// AI Interior Studio - Application Coordinator
import { RoomBuilder } from './room-model.js';
import { FurnitureFactory } from './furniture-models.js';
import { AIEngine } from './ai-engine.js';

class App {
  constructor() {
    this.canvas = document.getElementById('canvas3d');
    this.furnitureGroup = new THREE.Group();
    this.furnitureGroup.name = 'FurnitureGroup';
    this.furnitureList = [];
    this.selectedRoot = null;
    this.selectedPart = null;
    this.selectedTarget = null;
    this.selectedObject = null;
    this.editMode = 'part'; // 'part' | 'whole'
    this.isDragging = false;
    this.dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this.dragOffset = new THREE.Vector3();
    this.isDaylight = true;
    this.currentStyle = 'modern';
    this.geminiApiKey = localStorage.getItem('ai_interior_gemini_key') || '';
    this.isWalkthrough = false;
    this.keysDown = {};
    this.currentRoomDimensions = { width: 5.0, length: 4.5, height: 2.8 };

    this.initScene();
    this.initLights();
    this.initRoom();
    this.initRaycasting();
    this.initKeyboardControls();
    this.initUI();
    this.initProjects();

    // Generate initial default design
    this.triggerAIGeneration();

    // Start animation loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  // 1. SCENE SETUP
  initScene() {
    const width = this.canvas.clientWidth || window.innerWidth - 440;
    const height = this.canvas.clientHeight || window.innerHeight - 60;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0e17);

    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    this.camera.position.set(0, 4.5, 6.8);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.02; // Prevent going beneath floor
    this.controls.minDistance = 2.0;
    this.controls.maxDistance = 18.0;
    this.controls.target.set(0, 1.0, 0);

    this.scene.add(this.furnitureGroup);

    // Bounding Box Selection Highlight Helper
    this.selectionHelper = new THREE.BoxHelper(new THREE.Mesh(), 0x38bdf8);
    this.selectionHelper.name = 'SelectionBox';
    this.selectionHelper.material.depthTest = false;
    this.selectionHelper.material.transparent = true;
    this.selectionHelper.material.opacity = 0.9;
    this.selectionHelper.visible = false;
    this.scene.add(this.selectionHelper);

    window.addEventListener('resize', () => {
      const w = this.canvas.clientWidth;
      const h = this.canvas.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  // 2. LIGHTING SETUP
  initLights() {
    // Ambient light
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    this.scene.add(this.ambientLight);

    // Sun / Window Directional Light
    this.sunLight = new THREE.DirectionalLight(0xfffaed, 1.2);
    this.sunLight.position.set(-8, 9, 4);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 25;
    this.sunLight.shadow.camera.left = -6;
    this.sunLight.shadow.camera.right = 6;
    this.sunLight.shadow.camera.top = 6;
    this.sunLight.shadow.camera.bottom = -6;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);

    // Soft ceiling fill light
    this.ceilingLight = new THREE.PointLight(0xfff7ed, 0.6, 12, 1.5);
    this.ceilingLight.position.set(0, 2.7, 0);
    this.scene.add(this.ceilingLight);
  }

  // 3. ROOM BUILDER INITIALIZATION
  initRoom() {
    this.roomBuilder = new RoomBuilder(this.scene);
  }

  // 4. RAYCASTING, 3D MOUSE DRAGGING & SELECTION
  initRaycasting() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.canvas.addEventListener('pointerdown', (e) => {
      if (this.isWalkthrough) return;
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.furnitureGroup.children, true);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        let rootObj = clickedMesh;
        let chairGroup = null;
        let curr = clickedMesh;
        while (curr.parent && curr.parent !== this.furnitureGroup) {
          if (curr.name && curr.name.toLowerCase().includes('chair')) {
            chairGroup = curr;
          }
          curr = curr.parent;
        }
        rootObj = chairGroup || curr;

        this.selectTarget(rootObj, clickedMesh);

        // Initiate 3D Plane Dragging
        this.isDragging = true;
        this.controls.enabled = false;

        const targetWorldPos = new THREE.Vector3();
        this.selectedTarget.getWorldPosition(targetWorldPos);
        this.dragPlane.set(new THREE.Vector3(0, 1, 0), -targetWorldPos.y);

        const planeIntersect = new THREE.Vector3();
        if (this.raycaster.ray.intersectPlane(this.dragPlane, planeIntersect)) {
          this.dragOffset.copy(planeIntersect).sub(targetWorldPos);
        }
      } else {
        if (!this.isDragging) {
          this.deselectObject();
        }
      }
    });

    this.canvas.addEventListener('pointermove', (e) => {
      if (!this.isDragging || !this.selectedTarget || this.isWalkthrough) return;

      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const planeIntersect = new THREE.Vector3();

      if (this.raycaster.ray.intersectPlane(this.dragPlane, planeIntersect)) {
        const targetWorld = planeIntersect.sub(this.dragOffset);

        if (this.editMode === 'whole' || this.selectedTarget === this.selectedRoot) {
          // Constrain within room bounds
          const halfW = (this.currentRoomDimensions?.width || 5.0) / 2 - 0.25;
          const halfL = (this.currentRoomDimensions?.length || 4.5) / 2 - 0.25;
          this.selectedTarget.position.x = Math.max(-halfW, Math.min(halfW, targetWorld.x));
          this.selectedTarget.position.z = Math.max(-halfL, Math.min(halfL, targetWorld.z));
        } else {
          // Convert world pos to parent local coordinates for single part
          if (this.selectedTarget.parent) {
            const localPos = this.selectedTarget.parent.worldToLocal(targetWorld.clone());
            this.selectedTarget.position.x = localPos.x;
            this.selectedTarget.position.z = localPos.z;
          }
        }

        this.syncInspectorPosition();
        if (this.selectionHelper) this.selectionHelper.update();
      }
    });

    const stopDrag = () => {
      if (this.isDragging) {
        this.isDragging = false;
        if (!this.isWalkthrough) this.controls.enabled = true;
      }
    };

    this.canvas.addEventListener('pointerup', stopDrag);
    this.canvas.addEventListener('pointercancel', stopDrag);
  }

  // 4b. SELECTION COORDINATOR
  selectTarget(rootObj, clickedMesh) {
    this.selectedRoot = rootObj;
    this.selectedPart = clickedMesh;
    this.selectedObject = rootObj; // compatibility

    // Cache original local position on part for reset capability
    if (!clickedMesh.userData.origPos) {
      clickedMesh.userData.origPos = clickedMesh.position.clone();
    }

    this.updateTargetByMode();
  }

  updateTargetByMode() {
    if (!this.selectedRoot || !this.selectedPart) return;

    this.selectedTarget = this.editMode === 'part' ? this.selectedPart : this.selectedRoot;
    this.selectedObject = this.selectedTarget;

    const popup = document.getElementById('inspector-popup');
    const title = document.getElementById('inspector-title');
    const subtitle = document.getElementById('inspector-subtitle');
    const btnPart = document.getElementById('btn-mode-part');
    const btnWhole = document.getElementById('btn-mode-whole');

    popup.style.display = 'flex';
    title.textContent = this.selectedRoot.name || 'Furniture Item';
    if (subtitle) {
      const partName = this.getPartName(this.selectedPart);
      subtitle.textContent = this.editMode === 'part'
        ? `Editing Part: ${partName}`
        : `Editing Entire: ${this.selectedRoot.name}`;
      subtitle.style.color = this.editMode === 'part' ? '#10b981' : '#6366f1';
    }

    if (btnPart) btnPart.classList.toggle('active', this.editMode === 'part');
    if (btnWhole) btnWhole.classList.toggle('active', this.editMode === 'whole');

    // Update 3D Selection Box
    if (this.selectionHelper) {
      this.selectionHelper.setFromObject(this.selectedTarget);
      this.selectionHelper.visible = true;
      this.selectionHelper.update();
    }

    this.syncInspectorPosition();
    this.syncInspectorColor();
  }

  getPartName(mesh) {
    if (!mesh) return 'Part';
    if (mesh.name && mesh.name !== 'Part' && mesh.name !== '') return mesh.name;
    if (mesh.geometry) {
      if (mesh.geometry.type === 'CylinderGeometry') return 'Leg / Pillar';
      if (mesh.geometry.type === 'SphereGeometry') return 'Bulb / Sphere';
      if (mesh.geometry.type === 'PlaneGeometry') return 'Surface / Cushion';
      if (mesh.geometry.type === 'BoxGeometry') {
        const p = mesh.geometry.parameters;
        if (p && p.height < 0.1 && p.width > 0.5) return 'Top / Base Panel';
        if (p && p.height > 0.4 && p.depth < 0.25) return 'Backrest / Door';
        return 'Cushion / Block';
      }
    }
    return 'Component';
  }

  syncInspectorPosition() {
    if (!this.selectedTarget) return;
    const posX = document.getElementById('inspect-pos-x');
    const posY = document.getElementById('inspect-pos-y');
    const posZ = document.getElementById('inspect-pos-z');
    const valX = document.getElementById('val-pos-x');
    const valY = document.getElementById('val-pos-y');
    const valZ = document.getElementById('val-pos-z');

    const x = this.selectedTarget.position.x;
    const y = this.selectedTarget.position.y;
    const z = this.selectedTarget.position.z;

    if (posX) posX.value = x;
    if (posY) posY.value = y;
    if (posZ) posZ.value = z;

    if (valX) valX.textContent = `${x >= 0 ? '+' : ''}${x.toFixed(2)}m`;
    if (valY) valY.textContent = `${y >= 0 ? '+' : ''}${y.toFixed(2)}m`;
    if (valZ) valZ.textContent = `${z >= 0 ? '+' : ''}${z.toFixed(2)}m`;
  }

  syncInspectorColor() {
    if (!this.selectedTarget) return;
    const colorInput = document.getElementById('inspect-item-color');
    const colorHex = document.getElementById('inspect-item-color-hex');

    let hexStr = '#6366F1';
    let targetMesh = this.editMode === 'part' ? this.selectedPart : null;

    if (!targetMesh) {
      this.selectedRoot.traverse(child => {
        if (!targetMesh && child.isMesh && child.material && child.material.color && child.material.metalness < 0.7 && !child.material.map) {
          targetMesh = child;
        }
      });
    }

    if (targetMesh && targetMesh.material) {
      const mat = Array.isArray(targetMesh.material) ? targetMesh.material[0] : targetMesh.material;
      if (mat && mat.color) {
        hexStr = '#' + mat.color.getHexString().toUpperCase();
      }
    }

    if (colorInput) colorInput.value = hexStr.toLowerCase();
    if (colorHex) colorHex.textContent = hexStr.toUpperCase();

    // Update active state on quick swatches
    document.querySelectorAll('.quick-swatch').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.color.toUpperCase() === hexStr.toUpperCase());
    });
  }

  applyColorToTarget(hex) {
    if (!this.selectedTarget) return;
    const threeColor = new THREE.Color(hex);
    const colorInput = document.getElementById('inspect-item-color');
    const colorHex = document.getElementById('inspect-item-color-hex');

    if (colorInput) colorInput.value = hex.toLowerCase();
    if (colorHex) colorHex.textContent = hex.toUpperCase();

    document.querySelectorAll('.quick-swatch').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.color.toUpperCase() === hex.toUpperCase());
    });

    if (this.editMode === 'part' && this.selectedPart) {
      // Clone material so only THIS single part gets recolored
      if (this.selectedPart.material) {
        if (Array.isArray(this.selectedPart.material)) {
          this.selectedPart.material = this.selectedPart.material.map(m => m.clone());
          this.selectedPart.material.forEach(m => m.color.copy(threeColor));
        } else {
          this.selectedPart.material = this.selectedPart.material.clone();
          this.selectedPart.material.color.copy(threeColor);
        }
        this.selectedPart.userData.customColor = hex;
      }
      this.showToast(`Color changed: ${this.getPartName(this.selectedPart)} (${hex.toUpperCase()})`);
    } else if (this.selectedRoot) {
      // Recolor entire piece
      this.selectedRoot.userData.color = hex;
      this.selectedRoot.traverse(child => {
        if (child.isMesh && child.material) {
          const mat = child.material;
          if (mat.metalness > 0.75 || mat.isMeshBasicMaterial || mat.map) return;
          child.material = child.material.clone();
          child.material.color.copy(threeColor);
          child.userData.customColor = hex;
        }
      });
      this.showToast(`Color changed: ${this.selectedRoot.name} (${hex.toUpperCase()})`);
    }
  }

  deleteSelectedTarget() {
    if (!this.selectedTarget) return;
    if (this.editMode === 'part' && this.selectedPart && this.selectedPart.parent) {
      const pName = this.getPartName(this.selectedPart);
      this.selectedPart.parent.remove(this.selectedPart);
      this.deselectObject();
      this.showToast(`Removed part: ${pName}`);
    } else if (this.selectedRoot) {
      const rName = this.selectedRoot.name;
      this.furnitureGroup.remove(this.selectedRoot);
      this.deselectObject();
      this.showToast(`Removed item: ${rName}`);
    }
  }

  deselectObject() {
    this.selectedRoot = null;
    this.selectedPart = null;
    this.selectedTarget = null;
    this.selectedObject = null;
    if (this.selectionHelper) this.selectionHelper.visible = false;
    const popup = document.getElementById('inspector-popup');
    if (popup) popup.style.display = 'none';
  }

  // 4c. KEYBOARD CONTROLS FOR OBJECT & PART NUDGE & ROTATION
  initKeyboardControls() {
    window.addEventListener('keydown', (e) => {
      this.keysDown[e.code] = true;

      // Ignore hotkeys when typing in input/textarea/select
      const activeEl = document.activeElement;
      const tag = activeEl ? activeEl.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (this.selectedTarget && !this.isWalkthrough) {
        let step = e.shiftKey ? 0.2 : 0.05;

        if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
          e.preventDefault();
          this.selectedTarget.position.x -= step;
          this.syncInspectorPosition();
          if (this.selectionHelper) this.selectionHelper.update();
        } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
          e.preventDefault();
          this.selectedTarget.position.x += step;
          this.syncInspectorPosition();
          if (this.selectionHelper) this.selectionHelper.update();
        } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
          e.preventDefault();
          this.selectedTarget.position.z -= step;
          this.syncInspectorPosition();
          if (this.selectionHelper) this.selectionHelper.update();
        } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
          e.preventDefault();
          this.selectedTarget.position.z += step;
          this.syncInspectorPosition();
          if (this.selectionHelper) this.selectionHelper.update();
        } else if (e.code === 'KeyQ') {
          // Height Down
          e.preventDefault();
          this.selectedTarget.position.y -= step;
          this.syncInspectorPosition();
          if (this.selectionHelper) this.selectionHelper.update();
        } else if (e.code === 'KeyE') {
          // Height Up
          e.preventDefault();
          this.selectedTarget.position.y += step;
          this.syncInspectorPosition();
          if (this.selectionHelper) this.selectionHelper.update();
        } else if (e.code === 'KeyR') {
          e.preventDefault();
          this.selectedTarget.rotation.y += Math.PI / 4;
          if (this.selectionHelper) this.selectionHelper.update();
        } else if (e.code === 'Delete' || e.code === 'Backspace') {
          e.preventDefault();
          this.deleteSelectedTarget();
        } else if (e.code === 'Escape') {
          e.preventDefault();
          this.deselectObject();
        }
      } else if (e.code === 'Escape' && this.isWalkthrough) {
        this.setCameraPreset('3d');
        document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-view="3d"]')?.classList.add('active');
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keysDown[e.code] = false;
    });
  }

  // 5. USER INTERFACE & EVENT HANDLERS
  initUI() {
    // Tabs Navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const target = document.getElementById(btn.dataset.tab);
        if (target) target.classList.add('active');
      });
    });

    // Style Card Selection
    document.querySelectorAll('.style-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.style-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.currentStyle = card.dataset.style;
      });
    });

    // Generate AI Design Button
    document.getElementById('btn-generate-ai').addEventListener('click', () => {
      this.triggerAIGeneration();
    });

    // Camera View Presets
    document.querySelectorAll('[data-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.setCameraPreset(btn.dataset.view);
      });
    });

    // Cutaway Wall Toggle
    const cutawayBtn = document.getElementById('btn-toggle-cutaway');
    cutawayBtn.addEventListener('click', () => {
      cutawayBtn.classList.toggle('active');
      const isCutaway = cutawayBtn.classList.contains('active');
      this.roomBuilder.setCutaway(isCutaway);
      this.showToast(isCutaway ? 'Cutaway front wall active' : 'Full walls visible');
    });

    // Daylight / Night Toggle
    const daylightBtn = document.getElementById('btn-toggle-daylight');
    daylightBtn.addEventListener('click', () => {
      this.isDaylight = !this.isDaylight;
      daylightBtn.classList.toggle('active', this.isDaylight);
      daylightBtn.innerHTML = this.isDaylight ? '☀️ Day' : '🌙 Night';

      if (this.isDaylight) {
        this.scene.background.set(0x0a0e17);
        this.ambientLight.intensity = 0.55;
        this.sunLight.intensity = 1.2;
        this.ceilingLight.intensity = 0.6;
        this.showToast('Daylight simulation enabled');
      } else {
        this.scene.background.set(0x020408);
        this.ambientLight.intensity = 0.15;
        this.sunLight.intensity = 0.05;
        this.ceilingLight.intensity = 1.3;
        this.showToast('Moody evening lighting enabled');
      }
    });

    // Measurement Grid Toggle
    const gridBtn = document.getElementById('btn-toggle-grid');
    gridBtn.addEventListener('click', () => {
      gridBtn.classList.toggle('active');
      const grid = this.scene.getObjectByName('MeasurementGrid');
      if (grid) {
        grid.visible = gridBtn.classList.contains('active');
      }
    });

    // Reset Camera
    document.getElementById('btn-reset-cam').addEventListener('click', () => {
      this.setCameraPreset('3d');
    });

    // Inspector Popup Controls
    document.getElementById('btn-close-inspector')?.addEventListener('click', () => {
      this.deselectObject();
    });

    // Mode Toggle: Single Part vs Entire Piece
    document.getElementById('btn-mode-part')?.addEventListener('click', () => {
      this.editMode = 'part';
      this.updateTargetByMode();
      this.showToast(`Mode: Single Part (${this.getPartName(this.selectedPart)})`);
    });

    document.getElementById('btn-mode-whole')?.addEventListener('click', () => {
      this.editMode = 'whole';
      this.updateTargetByMode();
      this.showToast(`Mode: Entire Piece (${this.selectedRoot?.name})`);
    });

    // Position X, Y, Z sliders
    document.getElementById('inspect-pos-x')?.addEventListener('input', (e) => {
      if (this.selectedTarget) {
        this.selectedTarget.position.x = parseFloat(e.target.value);
        this.syncInspectorPosition();
        if (this.selectionHelper) this.selectionHelper.update();
      }
    });

    document.getElementById('inspect-pos-y')?.addEventListener('input', (e) => {
      if (this.selectedTarget) {
        this.selectedTarget.position.y = parseFloat(e.target.value);
        this.syncInspectorPosition();
        if (this.selectionHelper) this.selectionHelper.update();
      }
    });

    document.getElementById('inspect-pos-z')?.addEventListener('input', (e) => {
      if (this.selectedTarget) {
        this.selectedTarget.position.z = parseFloat(e.target.value);
        this.syncInspectorPosition();
        if (this.selectionHelper) this.selectionHelper.update();
      }
    });

    // 1-Click Quick Color Swatches
    document.querySelectorAll('.quick-swatch').forEach(btn => {
      btn.addEventListener('click', () => {
        const hex = btn.dataset.color;
        this.applyColorToTarget(hex);
      });
    });

    // Custom Color Picker input
    const inspectColor = document.getElementById('inspect-item-color');
    if (inspectColor) {
      inspectColor.addEventListener('input', (e) => {
        this.applyColorToTarget(e.target.value);
      });
    }

    // Random Color Generator
    document.getElementById('btn-random-color')?.addEventListener('click', () => {
      const palette = [
        '#FFFFFF', '#F5F5F0', '#D1D5DB', '#4B5563', '#111827',
        '#8B5A2B', '#3E2723', '#D4AF37', '#1B4332', '#52796F',
        '#1E3A8A', '#3B82F6', '#C2410C', '#D97706', '#DB2777'
      ];
      const randomColor = palette[Math.floor(Math.random() * palette.length)];
      this.applyColorToTarget(randomColor);
    });

    // Rotate button
    document.getElementById('btn-rotate-object')?.addEventListener('click', () => {
      if (this.selectedTarget) {
        this.selectedTarget.rotation.y += Math.PI / 4;
        if (this.selectionHelper) this.selectionHelper.update();
      }
    });

    // Reset part position button
    document.getElementById('btn-reset-part')?.addEventListener('click', () => {
      if (this.editMode === 'part' && this.selectedPart && this.selectedPart.userData.origPos) {
        this.selectedPart.position.copy(this.selectedPart.userData.origPos);
        this.selectedPart.rotation.set(0, 0, 0);
        this.syncInspectorPosition();
        if (this.selectionHelper) this.selectionHelper.update();
        this.showToast('Reset part to original position');
      } else if (this.selectedRoot) {
        this.selectedRoot.position.set(0, 0, 0);
        this.selectedRoot.rotation.set(0, 0, 0);
        this.syncInspectorPosition();
        if (this.selectionHelper) this.selectionHelper.update();
        this.showToast('Reset item to room center');
      }
    });

    // Delete button
    document.getElementById('btn-delete-object')?.addEventListener('click', () => {
      this.deleteSelectedTarget();
    });

    // Add items from catalog
    document.querySelectorAll('.add-catalog-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        this.addFurnitureItem({
          type: type,
          style: this.currentStyle,
          position: [0, 0, 0],
          rotation: [0, 0, 0]
        });
        this.showToast(`Added ${type.replace('_', ' ')} to center`);
      });
    });

    // Wall Color Picker & Flooring in Catalog tab
    const wallPicker = document.getElementById('wall-color-picker');
    wallPicker.addEventListener('input', (e) => {
      const hex = parseInt(e.target.value.replace('#', '0x'), 16);
      this.roomBuilder.setWallColor(hex);
    });

    const catFlooring = document.getElementById('catalog-flooring');
    catFlooring.addEventListener('change', (e) => {
      this.roomBuilder.setFlooring(e.target.value);
      this.showToast(`Flooring set to ${e.target.value}`);
    });

    // Clear all furniture
    document.getElementById('btn-clear-furniture').addEventListener('click', () => {
      while (this.furnitureGroup.children.length > 0) {
        this.furnitureGroup.remove(this.furnitureGroup.children[0]);
      }
      this.deselectObject();
      this.showToast('Cleared all furniture');
    });

    // Snapshot Button
    document.getElementById('btn-quick-screenshot').addEventListener('click', () => {
      this.captureSnapshot();
    });

    // Exit Walkthrough HUD Button
    const exitWalkBtn = document.getElementById('btn-exit-walk');
    if (exitWalkBtn) {
      exitWalkBtn.addEventListener('click', () => {
        this.setCameraPreset('3d');
        document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-view="3d"]')?.classList.add('active');
      });
    }

    // Design Specification Report Modal Handlers
    const reportModal = document.getElementById('report-modal');
    document.getElementById('btn-export-report')?.addEventListener('click', () => {
      this.openDesignReport();
    });

    document.getElementById('btn-print-report')?.addEventListener('click', () => {
      window.print();
    });

    document.getElementById('btn-close-report')?.addEventListener('click', () => {
      reportModal?.classList.remove('open');
    });

    // Gemini API Modal
    const apiModal = document.getElementById('api-modal');
    document.getElementById('btn-api-key').addEventListener('click', () => {
      document.getElementById('gemini-key-input').value = this.geminiApiKey;
      apiModal.classList.add('open');
    });
    document.getElementById('btn-close-modal').addEventListener('click', () => {
      apiModal.classList.remove('open');
    });
    document.getElementById('btn-save-key').addEventListener('click', () => {
      this.geminiApiKey = document.getElementById('gemini-key-input').value.trim();
      localStorage.setItem('ai_interior_gemini_key', this.geminiApiKey);
      apiModal.classList.remove('open');
      this.showToast(this.geminiApiKey ? 'Gemini API key saved!' : 'Cleared API key');
    });
  }

  // 6. CAMERA PRESETS & WALKTHROUGH
  setCameraPreset(mode) {
    const hud = document.getElementById('walkthrough-hud');
    if (mode === 'walk') {
      this.isWalkthrough = true;
      if (hud) hud.style.display = 'block';
      this.camera.position.set(0, 1.6, 1.6);
      this.controls.target.set(0, 1.55, -0.6);
      this.controls.maxPolarAngle = Math.PI - 0.05;
      this.controls.minDistance = 0.05;
      this.showToast('Walkthrough active! Use WASD or Arrow Keys to walk');
    } else {
      this.isWalkthrough = false;
      if (hud) hud.style.display = 'none';
      this.controls.maxPolarAngle = Math.PI / 2 - 0.02;
      this.controls.minDistance = 2.0;

      switch (mode) {
        case 'top':
          // Top-down Floor Plan
          this.camera.position.set(0, 9.0, 0.001);
          this.controls.target.set(0, 0, 0);
          break;
        case 'front':
          // Front elevation
          this.camera.position.set(0, 1.8, 6.5);
          this.controls.target.set(0, 1.4, 0);
          break;
        case '3d':
        default:
          // Free 3D Orbit
          this.camera.position.set(0, 4.5, 6.8);
          this.controls.target.set(0, 1.0, 0);
          break;
      }
    }
    this.controls.update();
  }

  // 7. AI DESIGN GENERATION
  async triggerAIGeneration() {
    this.showToast('AI is optimizing spatial layout...');

    const pref = {
      roomType: document.getElementById('room-type').value,
      dimensions: {
        width: parseFloat(document.getElementById('room-w').value) || 5.0,
        length: parseFloat(document.getElementById('room-l').value) || 4.5,
        height: parseFloat(document.getElementById('room-h').value) || 2.8
      },
      style: this.currentStyle,
      colorScheme: document.getElementById('color-scheme').value,
      flooring: document.getElementById('flooring-select').value,
      lighting: document.getElementById('lighting-select').value,
      customNotes: document.getElementById('custom-notes').value
    };

    // 1. Rebuild room architecture with new dimensions and style
    this.currentRoomDimensions = pref.dimensions;
    this.roomBuilder.buildRoom(pref.dimensions, 0xfaf5ee, pref.flooring);

    // 2. Clear old furniture
    while (this.furnitureGroup.children.length > 0) {
      this.furnitureGroup.remove(this.furnitureGroup.children[0]);
    }
    this.deselectObject();

    // 3. Generate AI recommendations
    const designPlan = await AIEngine.generateDesign(pref, this.geminiApiKey);
    this.lastDesignPlan = designPlan;

    // Apply wall color from plan
    if (designPlan.wallColorHex) {
      this.roomBuilder.setWallColor(designPlan.wallColorHex);
      document.getElementById('wall-color-picker').value = designPlan.palette.wallColorHex;
    }

    // 4. Populate 3D furniture
    designPlan.items.forEach(item => {
      this.addFurnitureItem(item);
    });

    // 5. Update AI Insights Tab UI
    document.getElementById('ai-concept-title').textContent = designPlan.conceptName;
    document.getElementById('ai-concept-desc').textContent = designPlan.description;
    document.getElementById('ai-spatial-text').textContent = designPlan.spatialRationale;
    document.getElementById('ai-lighting-text').textContent = designPlan.lightingPlan;
    document.getElementById('ai-total-budget').textContent = `$${designPlan.totalEstimatedCost.toLocaleString()}`;

    // Color Swatches
    const chipsContainer = document.getElementById('palette-chips-container');
    chipsContainer.innerHTML = '';
    const swatches = [
      { name: 'Walls', hex: designPlan.palette.wallColorHex },
      { name: 'Accent', hex: designPlan.palette.accentColorHex },
      { name: 'Furniture', hex: designPlan.palette.sofaColorHex },
      { name: 'Wood/Trim', hex: designPlan.palette.woodColorHex }
    ];
    swatches.forEach(sw => {
      const chip = document.createElement('div');
      chip.className = 'color-chip';
      chip.style.backgroundColor = sw.hex;
      chip.title = `${sw.name}: ${sw.hex}`;
      chipsContainer.appendChild(chip);
    });

    // Items Checklist
    const checklist = document.getElementById('ai-items-checklist');
    checklist.innerHTML = '';
    designPlan.items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'item-row';
      row.innerHTML = `
        <div>
          <strong>${item.name}</strong>
          <span style="color: var(--text-dim); margin-left: 6px;">${item.style}</span>
        </div>
        <span class="badge">$${item.cost}</span>
      `;
      checklist.appendChild(row);
    });

    this.showToast('Design generated & 3D space rendered!');
  }

  // 8. ADD FURNITURE ITEM FACTORY HELPER
  addFurnitureItem(itemData) {
    let meshGroup = null;
    const style = itemData.style || this.currentStyle;

    switch (itemData.type) {
      case 'sofa':
        meshGroup = FurnitureFactory.createSofa(style, itemData.color);
        break;
      case 'coffee_table':
        meshGroup = FurnitureFactory.createCoffeeTable(style, itemData.color);
        break;
      case 'tv_unit':
        meshGroup = FurnitureFactory.createTVUnit(style);
        break;
      case 'armchair':
        meshGroup = FurnitureFactory.createArmchair(style, itemData.color);
        break;
      case 'floor_lamp':
        meshGroup = FurnitureFactory.createFloorLamp(style);
        break;
      case 'bed':
        meshGroup = FurnitureFactory.createBed(style, itemData.color);
        break;
      case 'nightstand':
        meshGroup = FurnitureFactory.createNightstand(style);
        break;
      case 'desk':
        meshGroup = FurnitureFactory.createDesk(style);
        break;
      case 'office_chair':
        meshGroup = FurnitureFactory.createOfficeChair();
        break;
      case 'dining_table':
        meshGroup = FurnitureFactory.createDiningTable(style, itemData.color);
        break;
      case 'dining_chair':
        meshGroup = FurnitureFactory.createDiningChair(style, itemData.color, itemData.chairIndex || 1);
        break;
      case 'dining_set':
        // Decompose dining set into separate individual dining table and individual dining chairs
        const tablePos = itemData.position || [0, 0, 0];
        const table = FurnitureFactory.createDiningTable(style, itemData.color);
        table.position.set(...tablePos);
        if (itemData.rotation) table.rotation.set(...itemData.rotation);
        table.userData = { type: 'dining_table', name: 'Dining Table', cost: 650 };
        this.furnitureGroup.add(table);

        const chairConfigs = [
          { x: -0.55, z: 0.68, rotY: Math.PI, name: 'Dining Chair 1' },
          { x: 0.55, z: 0.68, rotY: Math.PI, name: 'Dining Chair 2' },
          { x: -0.55, z: -0.68, rotY: 0, name: 'Dining Chair 3' },
          { x: 0.55, z: -0.68, rotY: 0, name: 'Dining Chair 4' },
          { x: -1.15, z: 0, rotY: -Math.PI / 2, name: 'Dining Chair 5' },
          { x: 1.15, z: 0, rotY: Math.PI / 2, name: 'Dining Chair 6' }
        ];

        chairConfigs.forEach((cfg, idx) => {
          const chair = FurnitureFactory.createDiningChair(style, itemData.chairColor || 0xd97706, idx + 1);
          chair.name = cfg.name;
          chair.userData = { type: 'dining_chair', name: cfg.name, cost: 150 };
          chair.position.set(tablePos[0] + cfg.x, tablePos[1], tablePos[2] + cfg.z);
          chair.rotation.y = cfg.rotY;
          this.furnitureGroup.add(chair);
        });

        this.showToast('Added Dining Table and 6 separate moveable Dining Chairs!');
        return;
      case 'bookshelf':
        meshGroup = FurnitureFactory.createBookshelf(style);
        break;
      case 'plant':
        meshGroup = FurnitureFactory.createPlant();
        break;
      case 'wall_art':
        meshGroup = FurnitureFactory.createWallArt(style);
        break;
      case 'rug':
        const [w, l] = itemData.dimensions || [2.4, 1.8];
        meshGroup = FurnitureFactory.createRug(w, l, style);
        break;
      case 'wardrobe':
        meshGroup = FurnitureFactory.createWardrobe(style, itemData.color);
        break;
      case 'pendant_light':
        meshGroup = FurnitureFactory.createPendantLight(style);
        break;
      case 'floor_mirror':
        meshGroup = FurnitureFactory.createFloorMirror(style);
        break;
      case 'credenza':
        meshGroup = FurnitureFactory.createCredenza(style, itemData.color);
        break;
      case 'gaming_desk':
        meshGroup = FurnitureFactory.createGamingDesk(style);
        break;
      default:
        meshGroup = FurnitureFactory.createCoffeeTable(style);
        break;
    }

    if (meshGroup) {
      if (itemData.position) meshGroup.position.set(...itemData.position);
      if (itemData.rotation) meshGroup.rotation.set(...itemData.rotation);
      meshGroup.userData = { ...meshGroup.userData, ...itemData };
      this.furnitureGroup.add(meshGroup);
    }
  }

  // 9. SNAPSHOT & DESIGN REPORT EXPORT
  captureSnapshot() {
    this.renderer.render(this.scene, this.camera);
    const dataURL = this.canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `ai-interior-design-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
    this.showToast('High-resolution 3D snapshot saved!');
  }

  openDesignReport() {
    const reportModal = document.getElementById('report-modal');
    const reportBody = document.getElementById('report-body-content');
    if (!reportModal || !reportBody) return;

    // Capture current 3D canvas snapshot
    this.renderer.render(this.scene, this.camera);
    const snapshotUrl = this.canvas.toDataURL('image/png');

    const projectName = document.getElementById('project-name-input')?.value || 'Interior Design Project';
    const roomType = document.getElementById('room-type')?.value || 'living_room';
    const roomTypeLabel = roomType.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
    const w = parseFloat(document.getElementById('room-w')?.value) || 5.0;
    const l = parseFloat(document.getElementById('room-l')?.value) || 4.5;
    const h = parseFloat(document.getElementById('room-h')?.value) || 2.8;
    const areaSqM = (w * l).toFixed(1);
    const areaSqFt = ((w * l) * 10.7639).toFixed(0);
    const flooring = document.getElementById('flooring-select')?.value || 'wood_oak';
    const flooringLabel = flooring.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
    const lighting = document.getElementById('lighting-select')?.value || 'warm_ambient';
    const lightingLabel = lighting.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
    const wallColor = document.getElementById('wall-color-picker')?.value || '#faf5ee';

    // Compute total cost and schedule of all placed furniture
    let totalCost = 0;
    const itemsList = this.furnitureGroup.children.map((child, idx) => {
      const cost = child.userData?.cost || 150;
      totalCost += cost;
      return {
        id: idx + 1,
        name: child.name || child.userData?.name || 'Furniture Item',
        type: (child.userData?.type || 'furniture').replace('_', ' '),
        posX: child.position.x.toFixed(2),
        posZ: child.position.z.toFixed(2),
        cost: cost
      };
    });

    const dateStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

    reportBody.innerHTML = `
      <div class="report-grid-top">
        <div class="report-preview-box">
          <img src="${snapshotUrl}" alt="3D Space Snapshot" class="report-preview-img">
        </div>
        <div>
          <table class="report-specs-table">
            <tr><td>Project Name</td><td>${projectName}</td></tr>
            <tr><td>Date Created</td><td>${dateStr}</td></tr>
            <tr><td>Room Classification</td><td>${roomTypeLabel} (${this.currentStyle.toUpperCase()})</td></tr>
            <tr><td>Dimensions (W × L × H)</td><td>${w}m × ${l}m × ${h}m</td></tr>
            <tr><td>Floor Area</td><td>${areaSqM} m² (${areaSqFt} sq ft)</td></tr>
            <tr><td>Flooring Surface</td><td>${flooringLabel}</td></tr>
            <tr><td>Lighting Strategy</td><td>${lightingLabel}</td></tr>
          </table>
        </div>
      </div>

      <div>
        <h4 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); margin-bottom: 6px;">Palette & Material Accent Swatches</h4>
        <div class="report-swatch-list">
          <div class="report-swatch-card">
            <div class="report-swatch-color" style="background: ${wallColor};"></div>
            <div><div style="font-size: 11px; font-weight: 600;">Wall Paint</div><div style="font-size: 10px; color: var(--text-dim);">${wallColor}</div></div>
          </div>
          <div class="report-swatch-card">
            <div class="report-swatch-color" style="background: #3d4451;"></div>
            <div><div style="font-size: 11px; font-weight: 600;">Primary Fabric</div><div style="font-size: 10px; color: var(--text-dim);">#3D4451</div></div>
          </div>
          <div class="report-swatch-card">
            <div class="report-swatch-color" style="background: #8b5a2b;"></div>
            <div><div style="font-size: 11px; font-weight: 600;">Wood Grain</div><div style="font-size: 10px; color: var(--text-dim);">#8B5A2B</div></div>
          </div>
          <div class="report-swatch-card">
            <div class="report-swatch-color" style="background: #d4af37;"></div>
            <div><div style="font-size: 11px; font-weight: 600;">Metallic Accents</div><div style="font-size: 10px; color: var(--text-dim);">#D4AF37</div></div>
          </div>
        </div>
      </div>

      <div>
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 10px;">
          <h4 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted);">Itemized Fixture Schedule (${itemsList.length} Items)</h4>
          <div style="font-size: 16px; font-weight: 700; color: #10b981;">Total: $${totalCost.toLocaleString()}</div>
        </div>
        <table class="report-items-table">
          <thead>
            <tr>
              <th style="width: 40px;">#</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Room Coordinates (X, Z)</th>
              <th style="text-align: right;">Est. Cost</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList.map(item => `
              <tr>
                <td>${item.id}</td>
                <td><strong>${item.name}</strong></td>
                <td style="text-transform: capitalize;">${item.type}</td>
                <td>X: ${item.posX}m, Z: ${item.posZ}m</td>
                <td style="text-align: right; font-weight: 600;">$${item.cost}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    reportModal.classList.add('open');
  }

  // 10. PROJECT STORAGE & PERSISTENCE
  initProjects() {
    this.renderSavedProjectsList();

    // Save as new project
    document.getElementById('btn-save-as-new').addEventListener('click', () => {
      const name = document.getElementById('project-name-input').value.trim() || 'My Interior Project';
      this.saveProject(name);
    });

    document.getElementById('btn-save-project').addEventListener('click', () => {
      const name = document.getElementById('project-name-input').value.trim() || 'My Interior Project';
      this.saveProject(name);
    });

    // Export JSON
    document.getElementById('btn-export-json').addEventListener('click', () => {
      const projectData = this.getCurrentProjectData();
      const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `interior-project-${Date.now()}.json`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      this.showToast('Exported project JSON');
    });

    // Import JSON
    const fileInput = document.getElementById('file-import-json');
    document.getElementById('btn-trigger-import').addEventListener('click', () => {
      fileInput.click();
    });
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          this.loadProjectData(data);
          this.showToast('Imported project successfully!');
        } catch (err) {
          this.showToast('Failed to parse JSON file');
        }
      };
      reader.readAsText(file);
    });
  }

  getCurrentProjectData() {
    return {
      name: document.getElementById('project-name-input').value,
      roomType: document.getElementById('room-type').value,
      dimensions: {
        width: parseFloat(document.getElementById('room-w').value),
        length: parseFloat(document.getElementById('room-l').value),
        height: parseFloat(document.getElementById('room-h').value)
      },
      style: this.currentStyle,
      colorScheme: document.getElementById('color-scheme').value,
      flooring: document.getElementById('flooring-select').value,
      lighting: document.getElementById('lighting-select').value,
      wallColor: document.getElementById('wall-color-picker').value,
      furniture: this.furnitureGroup.children.map(child => ({
        type: child.userData?.type || 'furniture',
        name: child.name,
        position: [child.position.x, child.position.y, child.position.z],
        rotation: [child.rotation.x, child.rotation.y, child.rotation.z],
        cost: child.userData?.cost || 0
      }))
    };
  }

  saveProject(name) {
    const projects = JSON.parse(localStorage.getItem('ai_interior_projects') || '{}');
    projects[name] = this.getCurrentProjectData();
    localStorage.setItem('ai_interior_projects', JSON.stringify(projects));
    this.renderSavedProjectsList();
    this.showToast(`Saved project: "${name}"`);
  }

  renderSavedProjectsList() {
    const container = document.getElementById('saved-projects-list');
    container.innerHTML = '';
    const projects = JSON.parse(localStorage.getItem('ai_interior_projects') || '{}');
    const names = Object.keys(projects);

    if (names.length === 0) {
      container.innerHTML = '<span style="font-size: 11px; color: var(--text-dim);">No saved projects yet.</span>';
      return;
    }

    names.forEach(name => {
      const item = document.createElement('div');
      item.className = 'item-row';
      item.innerHTML = `
        <span style="font-weight: 600; cursor: pointer;">${name}</span>
        <div style="display: flex; gap: 6px;">
          <button class="btn btn-sm load-proj" style="padding: 3px 8px;">Load</button>
          <button class="btn btn-sm btn-danger del-proj" style="padding: 3px 6px;">&times;</button>
        </div>
      `;

      item.querySelector('.load-proj').addEventListener('click', () => {
        this.loadProjectData(projects[name]);
        this.showToast(`Loaded: ${name}`);
      });

      item.querySelector('.del-proj').addEventListener('click', () => {
        delete projects[name];
        localStorage.setItem('ai_interior_projects', JSON.stringify(projects));
        this.renderSavedProjectsList();
        this.showToast(`Deleted: ${name}`);
      });

      container.appendChild(item);
    });
  }

  loadProjectData(data) {
    if (!data) return;
    if (data.name) document.getElementById('project-name-input').value = data.name;
    if (data.roomType) document.getElementById('room-type').value = data.roomType;
    if (data.dimensions) {
      document.getElementById('room-w').value = data.dimensions.width;
      document.getElementById('room-l').value = data.dimensions.length;
      document.getElementById('room-h').value = data.dimensions.height;
    }
    if (data.style) {
      this.currentStyle = data.style;
      document.querySelectorAll('.style-card').forEach(c => {
        c.classList.toggle('selected', c.dataset.style === data.style);
      });
    }

    this.roomBuilder.buildRoom(data.dimensions, 0xfaf5ee, data.flooring || 'wood_oak');
    if (data.wallColor) {
      this.roomBuilder.setWallColor(parseInt(data.wallColor.replace('#', '0x'), 16));
    }

    while (this.furnitureGroup.children.length > 0) {
      this.furnitureGroup.remove(this.furnitureGroup.children[0]);
    }

    if (Array.isArray(data.furniture)) {
      data.furniture.forEach(item => this.addFurnitureItem(item));
    }
  }

  // 11. TOAST NOTIFICATION
  showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>✨</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // 12. ANIMATION LOOP WITH INTERACTIVE WALKTHROUGH
  animate() {
    requestAnimationFrame(this.animate);

    if (this.isWalkthrough) {
      const moveSpeed = 0.05;
      const forward = new THREE.Vector3();
      this.camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();

      const right = new THREE.Vector3();
      right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

      let moved = false;
      if (this.keysDown['KeyW'] || this.keysDown['ArrowUp']) {
        this.camera.position.addScaledVector(forward, moveSpeed);
        moved = true;
      }
      if (this.keysDown['KeyS'] || this.keysDown['ArrowDown']) {
        this.camera.position.addScaledVector(forward, -moveSpeed);
        moved = true;
      }
      if (this.keysDown['KeyA'] || this.keysDown['ArrowLeft']) {
        this.camera.position.addScaledVector(right, -moveSpeed);
        moved = true;
      }
      if (this.keysDown['KeyD'] || this.keysDown['ArrowRight']) {
        this.camera.position.addScaledVector(right, moveSpeed);
        moved = true;
      }

      // Constrain within room boundary
      const halfW = ((this.currentRoomDimensions && this.currentRoomDimensions.width) || 5.0) / 2 - 0.4;
      const halfL = ((this.currentRoomDimensions && this.currentRoomDimensions.length) || 4.5) / 2 - 0.4;
      this.camera.position.x = Math.max(-halfW, Math.min(halfW, this.camera.position.x));
      this.camera.position.z = Math.max(-halfL, Math.min(halfL, this.camera.position.z));
      this.camera.position.y = 1.6; // Constant eye level

      if (moved) {
        this.controls.target.copy(this.camera.position).add(forward.clone().multiplyScalar(2.0));
      }
    }

    if (this.selectionHelper && this.selectionHelper.visible) {
      this.selectionHelper.update();
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// Instantiate App once DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
