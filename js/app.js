// AI Interior Studio - Application Coordinator
import { RoomBuilder } from './room-model.js';
import { FurnitureFactory } from './furniture-models.js';
import { AIEngine } from './ai-engine.js';

class App {
  constructor() {
    // Authentication Guard
    try {
      const stored = localStorage.getItem('ai_interior_user');
      if (!stored) {
        window.location.replace('login.html?redirect=studio.html');
        return;
      }
    } catch (e) {
      window.location.replace('login.html?redirect=studio.html');
      return;
    }

    this.canvas = document.getElementById('canvas3d');
    this.furnitureGroup = new THREE.Group();
    this.furnitureGroup.name = 'FurnitureGroup';
    this.furnitureList = [];
    this.selectedRoot = null;
    this.selectedPart = null;
    this.selectedTarget = null;
    this.selectedObject = null;
    this.editMode = 'whole'; // 'whole' | 'part'
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
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);

      // In walkthrough mode, clicking door opens/shuts it
      if (this.isWalkthrough) {
        if (this.roomBuilder.doorGroup) {
          const doorHits = this.raycaster.intersectObjects([this.roomBuilder.doorGroup], true);
          if (doorHits.length > 0) {
            const currentSwing = this.roomBuilder.doorConfig.openAngle || 0;
            const nextSwing = currentSwing > 15 ? 0 : 80;
            this.roomBuilder.setDoorSwing(nextSwing);
            const swingSlider = document.getElementById('door-swing-slider');
            if (swingSlider) swingSlider.value = nextSwing;
            const swingVal = document.getElementById('door-swing-val');
            if (swingVal) swingVal.textContent = `${nextSwing}°`;
            this.showToast(nextSwing > 0 ? '🚪 Room Door opened' : '🚪 Room Door closed');
          }
        }
        return;
      }

      const interactiveTargets = [
        ...this.furnitureGroup.children,
        ...(this.roomBuilder.windowGroup ? [this.roomBuilder.windowGroup] : []),
        ...(this.roomBuilder.doorGroup ? [this.roomBuilder.doorGroup] : [])
      ];
      const intersects = this.raycaster.intersectObjects(interactiveTargets, true);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;

        // Check if clicked an architectural element (Window or Door)
        let isArch = null;
        let pCheck = clickedMesh;
        while (pCheck) {
          if (pCheck === this.roomBuilder.windowGroup) { isArch = 'window'; break; }
          if (pCheck === this.roomBuilder.doorGroup) { isArch = 'door'; break; }
          pCheck = pCheck.parent;
        }

        if (isArch === 'window') {
          this.deselectObject();
          this.showToast('🪟 Picture Window selected - Adjust placement in Setup');
          document.querySelector('[data-tab="tab-setup"]')?.click();
          document.getElementById('card-door-window')?.scrollIntoView({ behavior: 'smooth' });
          return;
        }

        if (isArch === 'door') {
          this.deselectObject();
          const currentSwing = this.roomBuilder.doorConfig.openAngle || 0;
          const nextSwing = currentSwing > 15 ? 0 : 80;
          this.roomBuilder.setDoorSwing(nextSwing);
          const swingSlider = document.getElementById('door-swing-slider');
          if (swingSlider) swingSlider.value = nextSwing;
          const swingVal = document.getElementById('door-swing-val');
          if (swingVal) swingVal.textContent = `${nextSwing}°`;
          this.showToast(nextSwing > 0 ? '🚪 Room Door opened (80°)' : '🚪 Room Door closed (0°)');
          document.querySelector('[data-tab="tab-setup"]')?.click();
          document.getElementById('card-door-window')?.scrollIntoView({ behavior: 'smooth' });
          return;
        }

        let rootObj = clickedMesh;
        let chairSubGroup = null;
        let curr = clickedMesh;

        // Climb up the hierarchy to find the root furniture item or nested chair/stool group
        while (curr.parent && curr.parent !== this.furnitureGroup) {
          if (curr.type === 'Group' && (curr.userData?.type === 'dining_chair' || curr.userData?.type === 'office_chair' || curr.userData?.type === 'bar_stool' || (curr.name && (curr.name.toLowerCase().includes('chair') || curr.name.toLowerCase().includes('stool')) && !curr.isMesh))) {
            chairSubGroup = curr;
          }
          curr = curr.parent;
        }
        rootObj = chairSubGroup || curr;

        this.selectTarget(rootObj, clickedMesh);

        // Initiate 3D Plane Dragging
        this.isDragging = true;
        this.controls.enabled = false;

        const targetWorldPos = new THREE.Vector3();
        this.selectedTarget.getWorldPosition(targetWorldPos);

        const isWallMounted = this.selectedRoot?.userData?.isWallMounted || this.selectedRoot?.userData?.type === 'wall_art';
        if (isWallMounted) {
          const rotY = this.selectedRoot.rotation.y;
          const isSideWall = Math.abs(Math.sin(rotY)) > 0.5;
          if (isSideWall) {
            this.dragPlane.set(new THREE.Vector3(1, 0, 0), -targetWorldPos.x);
          } else {
            this.dragPlane.set(new THREE.Vector3(0, 0, 1), -targetWorldPos.z);
          }
        } else {
          this.dragPlane.set(new THREE.Vector3(0, 1, 0), -targetWorldPos.y);
        }

        const planeIntersect = new THREE.Vector3();
        if (this.raycaster.ray.intersectPlane(this.dragPlane, planeIntersect)) {
          this.dragOffset.copy(planeIntersect).sub(targetWorldPos);
        }
      } else {
        // No furniture hit! Check if user clicked a wall to customize its color
        const wallTargets = [
          this.roomBuilder?.walls?.back,
          this.roomBuilder?.walls?.left,
          this.roomBuilder?.walls?.right
        ].filter(Boolean);

        const wallHits = this.raycaster.intersectObjects(wallTargets, false);
        if (wallHits.length > 0) {
          const clickedWall = wallHits[0].object;
          this.selectWall(clickedWall);
          return;
        }

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

        const isWallMounted = this.selectedRoot?.userData?.isWallMounted || this.selectedRoot?.userData?.type === 'wall_art';
        if (isWallMounted) {
          const roomW = this.currentRoomDimensions?.width || 5.0;
          const roomL = this.currentRoomDimensions?.length || 4.5;
          const roomH = this.currentRoomDimensions?.height || 2.8;
          const halfW = roomW / 2;
          const halfL = roomL / 2;

          const isSideWall = Math.abs(Math.sin(this.selectedRoot.rotation.y)) > 0.5;
          const isRightWall = this.selectedRoot.position.x > 0;

          // Height / Elevation clamp
          const clampedY = Math.max(0.6, Math.min(roomH - 0.4, targetWorld.y));
          this.selectedRoot.position.y = clampedY;

          if (isSideWall) {
            const clampedZ = Math.max(-halfL + 0.7, Math.min(halfL - 0.7, targetWorld.z));
            this.selectedRoot.position.z = clampedZ;
            this.selectedRoot.position.x = isRightWall ? (halfW - 0.04) : (-halfW + 0.04);
          } else {
            const clampedX = Math.max(-halfW + 0.7, Math.min(halfW - 0.7, targetWorld.x));
            this.selectedRoot.position.x = clampedX;
            this.selectedRoot.position.z = -halfL + 0.04;
          }
        } else if (this.editMode === 'whole' || this.selectedTarget === this.selectedRoot) {
          let posX = targetWorld.x;
          let posZ = targetWorld.z;
          if (this.selectedTarget.parent && this.selectedTarget.parent !== this.furnitureGroup && this.selectedTarget.parent !== this.scene) {
            const localPos = this.selectedTarget.parent.worldToLocal(targetWorld.clone());
            posX = localPos.x;
            posZ = localPos.z;
          }
          // Constrain within room bounds
          const halfW = (this.currentRoomDimensions?.width || 5.0) / 2 - 0.25;
          const halfL = (this.currentRoomDimensions?.length || 4.5) / 2 - 0.25;
          this.selectedTarget.position.x = Math.max(-halfW, Math.min(halfW, posX));
          this.selectedTarget.position.z = Math.max(-halfL, Math.min(halfL, posZ));
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
    if (this.selectedRoot !== rootObj) {
      this.editMode = 'whole';
    }
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
    if (!this.selectedRoot) return;

    this.selectedWall = null;
    this.selectedTarget = (this.editMode === 'part' && this.selectedPart) ? this.selectedPart : this.selectedRoot;
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

    const modeToggle = document.getElementById('inspector-mode-toggle');
    const wallPanel = document.getElementById('inspector-wall-panel');
    const actions = document.getElementById('inspector-actions');
    const shortcutsTip = document.getElementById('inspector-shortcuts-tip');
    if (modeToggle) modeToggle.style.display = 'flex';
    if (wallPanel) wallPanel.style.display = 'none';
    if (actions) actions.style.display = 'grid';
    if (shortcutsTip) shortcutsTip.style.display = 'block';

    const isWallArt = this.selectedRoot?.userData?.type === 'wall_art' || this.selectedRoot?.userData?.isWallMounted;
    const wallartPanel = document.getElementById('inspector-wallart-panel');
    const stdControls = document.getElementById('inspector-standard-controls');
    if (wallartPanel && stdControls) {
      if (isWallArt) {
        wallartPanel.style.display = 'block';
        stdControls.style.display = 'none';
        this.syncWallArtInspector();
      } else {
        wallartPanel.style.display = 'none';
        stdControls.style.display = 'block';
      }
    }

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

    if (this.selectedRoot?.userData?.type === 'wall_art' || this.selectedRoot?.userData?.isWallMounted) {
      this.syncWallArtInspector();
    }

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
      if (this.selectedRoot.parent) {
        this.selectedRoot.parent.remove(this.selectedRoot);
      } else {
        this.furnitureGroup.remove(this.selectedRoot);
      }
      this.deselectObject();
      this.showToast(`Removed item: ${rName}`);
    }
  }

  rotateSelected() {
    if (!this.selectedTarget) return;

    const isWallMounted = this.selectedRoot?.userData?.isWallMounted || this.selectedRoot?.userData?.type === 'wall_art';
    if (isWallMounted) {
      const rotY = this.selectedRoot.rotation.y;
      const isSideWall = Math.abs(Math.sin(rotY)) > 0.5;
      const isRightWall = this.selectedRoot.position.x > 0;

      if (!isSideWall) {
        // From Back wall -> move to Right wall
        this.setWallArtPlacement(this.selectedRoot, 'right', 0, this.selectedRoot.position.y);
        this.showToast('🖼️ Wall Art moved to Right Wall');
      } else if (isRightWall) {
        // From Right wall -> move to Left wall
        this.setWallArtPlacement(this.selectedRoot, 'left', 0, this.selectedRoot.position.y);
        this.showToast('🖼️ Wall Art moved to Left Wall');
      } else {
        // From Left wall -> move to Back wall
        this.setWallArtPlacement(this.selectedRoot, 'back', 0, this.selectedRoot.position.y);
        this.showToast('🖼️ Wall Art moved to Back Wall');
      }
      this.syncWallArtInspector();
    } else {
      this.selectedTarget.rotation.y += Math.PI / 4;
      this.syncInspectorPosition();
    }

    this.syncInspectorPosition();
    if (this.selectionHelper) this.selectionHelper.update();
  }

  deselectObject() {
    this.selectedRoot = null;
    this.selectedPart = null;
    this.selectedTarget = null;
    this.selectedObject = null;
    this.selectedWall = null;
    if (this.selectionHelper) this.selectionHelper.visible = false;
    const popup = document.getElementById('inspector-popup');
    if (popup) popup.style.display = 'none';
    const modeToggle = document.getElementById('inspector-mode-toggle');
    const wallartPanel = document.getElementById('inspector-wallart-panel');
    const wallPanel = document.getElementById('inspector-wall-panel');
    const stdControls = document.getElementById('inspector-standard-controls');
    const actions = document.getElementById('inspector-actions');
    const shortcutsTip = document.getElementById('inspector-shortcuts-tip');

    if (modeToggle) modeToggle.style.display = 'flex';
    if (wallartPanel) wallartPanel.style.display = 'none';
    if (wallPanel) wallPanel.style.display = 'none';
    if (stdControls) stdControls.style.display = 'block';
    if (actions) actions.style.display = 'grid';
    if (shortcutsTip) shortcutsTip.style.display = 'block';
  }

  // 4b-i. DIRECT 3D SINGLE WALL SELECTION
  selectWall(wallMesh) {
    if (!wallMesh) return;
    this.selectedWall = wallMesh;
    this.selectedRoot = null;
    this.selectedPart = null;
    this.selectedTarget = null;
    this.selectedObject = null;
    this.isDragging = false;
    this.controls.enabled = true;

    const popup = document.getElementById('inspector-popup');
    const title = document.getElementById('inspector-title');
    const subtitle = document.getElementById('inspector-subtitle');
    const modeToggle = document.getElementById('inspector-mode-toggle');
    const wallartPanel = document.getElementById('inspector-wallart-panel');
    const wallPanel = document.getElementById('inspector-wall-panel');
    const stdControls = document.getElementById('inspector-standard-controls');
    const actions = document.getElementById('inspector-actions');
    const shortcutsTip = document.getElementById('inspector-shortcuts-tip');

    if (popup) popup.style.display = 'flex';
    if (title) title.textContent = `🧱 ${wallMesh.name}`;
    if (subtitle) {
      subtitle.textContent = `Single Wall Color & Accent Finish`;
      subtitle.style.color = '#38bdf8';
    }
    if (modeToggle) modeToggle.style.display = 'none';
    if (wallartPanel) wallartPanel.style.display = 'none';
    if (stdControls) stdControls.style.display = 'none';
    if (wallPanel) wallPanel.style.display = 'block';
    if (actions) actions.style.display = 'none';
    if (shortcutsTip) shortcutsTip.style.display = 'none';

    if (this.selectionHelper) {
      this.selectionHelper.setFromObject(wallMesh);
      this.selectionHelper.visible = true;
      this.selectionHelper.update();
    }

    this.syncWallInspector(wallMesh);
    this.showToast(`Selected ${wallMesh.name} - Choose a paint finish`);
  }

  syncWallInspector(wallMesh) {
    const wall = wallMesh || this.selectedWall;
    if (!wall || !wall.material) return;
    const hex = '#' + wall.material.color.getHexString().toUpperCase();
    const heading = document.getElementById('inspector-wall-heading');
    const badge = document.getElementById('inspector-wall-color-badge');
    const hexSpan = document.getElementById('inspector-wall-color-hex');
    const colorPicker = document.getElementById('inspector-wall-color-picker');
    const targetSelect = document.getElementById('inspector-wall-target-select');

    if (heading) heading.textContent = `🧱 ${wall.name || 'Room Wall'}`;
    if (badge) badge.textContent = hex;
    if (hexSpan) hexSpan.textContent = hex;
    if (colorPicker) colorPicker.value = hex.toLowerCase();
    if (targetSelect) targetSelect.value = 'current';

    document.querySelectorAll('.wall-swatch-inspect').forEach(b => {
      b.classList.toggle('active', b.dataset.color.toUpperCase() === hex.toUpperCase());
    });
  }

  // 4b-ii. WALL ART SPATIAL & STYLING HELPERS
  getWallArtInfo(artObj) {
    if (!artObj) return null;
    const roomW = this.currentRoomDimensions?.width || 5.0;
    const roomL = this.currentRoomDimensions?.length || 4.5;
    const rotY = artObj.rotation.y;
    const isSideWall = Math.abs(Math.sin(rotY)) > 0.5;
    const isRightWall = artObj.position.x > 0;

    let wall = 'back';
    let slide = artObj.position.x;
    if (isSideWall) {
      wall = isRightWall ? 'right' : 'left';
      slide = artObj.position.z;
    }

    return {
      wall,
      slide,
      height: artObj.position.y,
      width: artObj.userData.artWidth || 1.2,
      artHeight: artObj.userData.artHeight || 0.9,
      theme: artObj.userData.artTheme || 'geometric',
      frameColor: artObj.userData.frameColor || '#18181b'
    };
  }

  setWallArtPlacement(artObj, wall, slide, height) {
    if (!artObj) return;
    const roomW = this.currentRoomDimensions?.width || 5.0;
    const roomL = this.currentRoomDimensions?.length || 4.5;
    const halfW = roomW / 2;
    const halfL = roomL / 2;

    if (height !== undefined && height !== null) {
      artObj.position.y = parseFloat(height);
    }

    if (wall === 'back') {
      artObj.rotation.set(0, 0, 0);
      artObj.position.z = -halfL + 0.04;
      if (slide !== undefined && slide !== null) {
        artObj.position.x = Math.max(-halfW + 0.7, Math.min(halfW - 0.7, parseFloat(slide)));
      }
    } else if (wall === 'left') {
      artObj.rotation.set(0, Math.PI / 2, 0);
      artObj.position.x = -halfW + 0.04;
      if (slide !== undefined && slide !== null) {
        artObj.position.z = Math.max(-halfL + 0.7, Math.min(halfL - 0.7, parseFloat(slide)));
      }
    } else if (wall === 'right') {
      artObj.rotation.set(0, -Math.PI / 2, 0);
      artObj.position.x = halfW - 0.04;
      if (slide !== undefined && slide !== null) {
        artObj.position.z = Math.max(-halfL + 0.7, Math.min(halfL - 0.7, parseFloat(slide)));
      }
    }
    artObj.userData.wall = wall;
    if (this.selectionHelper && this.selectedTarget === artObj) {
      this.selectionHelper.update();
    }
  }

  getOrCreateWallArt() {
    let artObj = null;
    this.furnitureGroup.traverse(child => {
      if (!artObj && (child.userData?.type === 'wall_art' || child.userData?.isWallMounted)) {
        artObj = child;
      }
    });
    if (!artObj) {
      artObj = FurnitureFactory.createWallArt(this.currentStyle, 'geometric', 1.2, 0.9);
      const halfL = (this.currentRoomDimensions?.length || 4.5) / 2;
      artObj.position.set(0, 1.8, -halfL + 0.04);
      this.furnitureGroup.add(artObj);
      this.currentFurniture.push(artObj);
    }
    return artObj;
  }

  syncWallArtInspector() {
    if (!this.selectedRoot || (this.selectedRoot.userData?.type !== 'wall_art' && !this.selectedRoot.userData?.isWallMounted)) return;
    const info = this.getWallArtInfo(this.selectedRoot);
    if (!info) return;

    const wallSelect = document.getElementById('wallart-wall-select');
    const wallBadge = document.getElementById('wallart-wall-badge');
    const slideSlider = document.getElementById('wallart-slide-slider');
    const slideVal = document.getElementById('wallart-slide-val');
    const heightSlider = document.getElementById('wallart-height-slider');
    const heightVal = document.getElementById('wallart-height-val');
    const wSlider = document.getElementById('wallart-w-slider');
    const wVal = document.getElementById('wallart-w-val');
    const hSlider = document.getElementById('wallart-h-slider');
    const hVal = document.getElementById('wallart-h-val');
    const themeSelect = document.getElementById('wallart-theme-select');

    if (wallSelect) wallSelect.value = info.wall;
    if (wallBadge) {
      wallBadge.textContent = info.wall === 'back' ? 'Back Wall' : (info.wall === 'left' ? 'Left Wall' : 'Right Wall');
    }
    if (slideSlider) slideSlider.value = info.slide;
    if (slideVal) slideVal.textContent = `${info.slide >= 0 ? '+' : ''}${info.slide.toFixed(2)}m`;
    if (heightSlider) heightSlider.value = info.height;
    if (heightVal) heightVal.textContent = `${info.height.toFixed(2)}m`;
    if (wSlider) wSlider.value = info.width;
    if (wVal) wVal.textContent = `${info.width.toFixed(1)}m`;
    if (hSlider) hSlider.value = info.artHeight;
    if (hVal) hVal.textContent = `${info.artHeight.toFixed(1)}m`;
    if (themeSelect) themeSelect.value = info.theme;

    this.syncWallArtSetupTab(info);
  }

  syncWallArtSetupTab(info) {
    if (!info) {
      let artObj = null;
      this.furnitureGroup.traverse(child => {
        if (!artObj && (child.userData?.type === 'wall_art' || child.userData?.isWallMounted)) {
          artObj = child;
        }
      });
      if (artObj) info = this.getWallArtInfo(artObj);
    }
    if (!info) return;

    const setupWall = document.getElementById('setup-art-wall-select');
    const setupPill = document.getElementById('setup-art-status-pill');
    const setupSlide = document.getElementById('setup-art-pos-slider');
    const setupSlideVal = document.getElementById('setup-art-pos-val');
    const setupHeight = document.getElementById('setup-art-height-slider');
    const setupHeightVal = document.getElementById('setup-art-height-val');
    const setupTheme = document.getElementById('setup-art-theme-select');
    const setupW = document.getElementById('setup-art-w-slider');
    const setupWVal = document.getElementById('setup-art-w-val');
    const setupH = document.getElementById('setup-art-h-slider');
    const setupHVal = document.getElementById('setup-art-h-val');

    const wallName = info.wall === 'back' ? 'Back Wall' : (info.wall === 'left' ? 'Left Wall' : 'Right Wall');
    if (setupWall) setupWall.value = info.wall;
    if (setupPill) setupPill.textContent = wallName;
    if (setupSlide) setupSlide.value = info.slide;
    if (setupSlideVal) setupSlideVal.textContent = `${info.slide >= 0 ? '+' : ''}${info.slide.toFixed(1)}m`;
    if (setupHeight) setupHeight.value = info.height;
    if (setupHeightVal) setupHeightVal.textContent = `${info.height.toFixed(2)}m`;
    if (setupTheme) setupTheme.value = info.theme;
    if (setupW) setupW.value = info.width;
    if (setupWVal) setupWVal.textContent = `${info.width.toFixed(1)}m`;
    if (setupH) setupH.value = info.artHeight;
    if (setupHVal) setupHVal.textContent = `${info.artHeight.toFixed(1)}m`;
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
        const isWallMounted = this.selectedRoot?.userData?.isWallMounted || this.selectedRoot?.userData?.type === 'wall_art';

        if (isWallMounted) {
          const roomW = this.currentRoomDimensions?.width || 5.0;
          const roomL = this.currentRoomDimensions?.length || 4.5;
          const roomH = this.currentRoomDimensions?.height || 2.8;
          const halfW = roomW / 2;
          const halfL = roomL / 2;
          const isSideWall = Math.abs(Math.sin(this.selectedRoot.rotation.y)) > 0.5;

          if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'KeyE') {
            e.preventDefault();
            this.selectedRoot.position.y = Math.min(roomH - 0.4, this.selectedRoot.position.y + step);
            this.syncInspectorPosition();
            if (this.selectionHelper) this.selectionHelper.update();
          } else if (e.code === 'ArrowDown' || e.code === 'KeyS' || e.code === 'KeyQ') {
            e.preventDefault();
            this.selectedRoot.position.y = Math.max(0.6, this.selectedRoot.position.y - step);
            this.syncInspectorPosition();
            if (this.selectionHelper) this.selectionHelper.update();
          } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
            e.preventDefault();
            if (isSideWall) {
              this.selectedRoot.position.z = Math.max(-halfL + 0.7, this.selectedRoot.position.z - step);
            } else {
              this.selectedRoot.position.x = Math.max(-halfW + 0.7, this.selectedRoot.position.x - step);
            }
            this.syncInspectorPosition();
            if (this.selectionHelper) this.selectionHelper.update();
          } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
            e.preventDefault();
            if (isSideWall) {
              this.selectedRoot.position.z = Math.min(halfL - 0.7, this.selectedRoot.position.z + step);
            } else {
              this.selectedRoot.position.x = Math.min(halfW - 0.7, this.selectedRoot.position.x + step);
            }
            this.syncInspectorPosition();
            if (this.selectionHelper) this.selectionHelper.update();
          } else if (e.code === 'KeyR') {
            e.preventDefault();
            this.rotateSelected();
          } else if (e.code === 'Delete' || e.code === 'Backspace') {
            e.preventDefault();
            this.deleteSelectedTarget();
          } else if (e.code === 'Escape') {
            e.preventDefault();
            this.deselectObject();
          }
        } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
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
          this.rotateSelected();
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

    // Style Card Selection & Instant Real-Time 3D Generation
    const stylePresets = {
      modern: {
        colorScheme: 'warm_neutral',
        flooring: 'wood_oak',
        label: 'Modern'
      },
      minimalist: {
        colorScheme: 'cool_scandi',
        flooring: 'tile',
        label: 'Minimalist'
      },
      luxury: {
        colorScheme: 'dark_luxury',
        flooring: 'marble',
        label: 'Luxury'
      },
      traditional: {
        colorScheme: 'earthy_terracotta',
        flooring: 'dark_walnut',
        label: 'Traditional'
      }
    };

    document.querySelectorAll('.style-card').forEach(card => {
      card.addEventListener('click', () => {
        const style = card.dataset.style;
        document.querySelectorAll('.style-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.currentStyle = style;

        // Auto-configure matching Color Palette & Flooring in the UI
        const preset = stylePresets[style];
        if (preset) {
          const colorSelect = document.getElementById('color-scheme');
          const floorSelect = document.getElementById('flooring-select');
          if (colorSelect) colorSelect.value = preset.colorScheme;
          if (floorSelect) floorSelect.value = preset.flooring;
        }

        // Immediately re-generate room with the selected style
        this.triggerAIGeneration();
        this.showToast(`✨ Applied ${preset ? preset.label : style} Design Style`);
      });
    });

    // Instant Room Type Switching
    document.getElementById('room-type')?.addEventListener('change', () => {
      this.triggerAIGeneration();
      const rName = document.getElementById('room-type').options[document.getElementById('room-type').selectedIndex]?.text || 'Space';
      this.showToast(`Switched space to ${rName}`);
    });

    // Instant Color Scheme Switching
    document.getElementById('color-scheme')?.addEventListener('change', () => {
      this.triggerAIGeneration();
      const cName = document.getElementById('color-scheme').options[document.getElementById('color-scheme').selectedIndex]?.text || 'Palette';
      this.showToast(`Applied ${cName}`);
    });

    // Instant Flooring Switching
    document.getElementById('flooring-select')?.addEventListener('change', (e) => {
      this.roomBuilder.setFlooring(e.target.value);
      const fName = e.target.options[e.target.selectedIndex]?.text || 'Flooring';
      this.showToast(`Flooring set to ${fName}`);
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
      this.rotateSelected();
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
        const isWall = this.selectedRoot.userData?.type === 'wall_art' || this.selectedRoot.userData?.isWallMounted;
        const halfL = (this.currentRoomDimensions?.length || 4.5) / 2;
        if (isWall) {
          this.selectedRoot.position.set(0, 1.8, -halfL + 0.04);
          this.selectedRoot.rotation.set(0, 0, 0);
          this.showToast('Reset Wall Art to Back Wall');
        } else {
          this.selectedRoot.position.set(0, 0, 0);
          this.selectedRoot.rotation.set(0, 0, 0);
          this.showToast('Reset item to room center');
        }
        this.syncInspectorPosition();
        if (this.selectionHelper) this.selectionHelper.update();
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
        const isWall = type === 'wall_art';
        const halfL = (this.currentRoomDimensions?.length || 4.5) / 2;
        this.addFurnitureItem({
          type: type,
          style: this.currentStyle,
          position: isWall ? [0, 1.8, -halfL + 0.04] : [0, 0, 0],
          rotation: [0, 0, 0]
        });
        this.showToast(isWall ? '🖼️ Added Wall Art to Back Wall' : `Added ${type.replace('_', ' ')} to center`);
      });
    });

    // Flooring in Catalog tab
    const catFlooring = document.getElementById('catalog-flooring');
    catFlooring?.addEventListener('change', (e) => {
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

    // Studio Sign Out button
    document.getElementById('btn-studio-signout')?.addEventListener('click', () => {
      localStorage.removeItem('ai_interior_user');
      window.location.href = 'signin.html?redirect=studio.html';
    });

    // Display user session in studio navbar if signed in
    try {
      const stored = localStorage.getItem('ai_interior_user');
      if (stored) {
        const user = JSON.parse(stored);
        const label = document.getElementById('studio-auth-label');
        if (label && user && user.name) {
          label.textContent = user.name.split(' ')[0];
          const icon = document.getElementById('studio-auth-icon');
          if (icon && user.avatarInitial) {
            icon.textContent = '✨';
          }
          const link = document.getElementById('studio-auth-link');
          if (link) {
            link.title = `Signed in as ${user.name} (${user.email || ''})`;
          }
        }
        // Only show Admin portal link if user is bhuvan@gmail.com
        const adminBtn = document.getElementById('btn-studio-admin');
        if (adminBtn) {
          if (user.role === 'admin' && user.email && user.email.toLowerCase() === 'bhuvan@gmail.com') {
            adminBtn.style.display = 'inline-flex';
          } else {
            adminBtn.style.display = 'none';
          }
        }
      }
    } catch (e) {}

    // Initialize Door, Window, Wall Art, and Single Wall Color controls
    this.initArchitecturalControls();
    this.initWallArtControls();
    this.initWallColorControls();
  }

  initWallArtControls() {
    // --- INSPECTOR POPUP WALL ART CONTROLS ---
    const wallSelect = document.getElementById('wallart-wall-select');
    const wallBadge = document.getElementById('wallart-wall-badge');
    const slideSlider = document.getElementById('wallart-slide-slider');
    const slideVal = document.getElementById('wallart-slide-val');
    const heightSlider = document.getElementById('wallart-height-slider');
    const heightVal = document.getElementById('wallart-height-val');
    const wSlider = document.getElementById('wallart-w-slider');
    const wVal = document.getElementById('wallart-w-val');
    const hSlider = document.getElementById('wallart-h-slider');
    const hVal = document.getElementById('wallart-h-val');
    const themeSelect = document.getElementById('wallart-theme-select');

    wallSelect?.addEventListener('change', (e) => {
      if (!this.selectedRoot || (!this.selectedRoot.userData?.isWallMounted && this.selectedRoot.userData?.type !== 'wall_art')) return;
      const wall = e.target.value;
      const info = this.getWallArtInfo(this.selectedRoot);
      this.setWallArtPlacement(this.selectedRoot, wall, info ? info.slide : 0, info ? info.height : 1.8);
      if (wallBadge) {
        wallBadge.textContent = wall === 'back' ? 'Back Wall' : (wall === 'left' ? 'Left Wall' : 'Right Wall');
      }
      this.syncWallArtInspector();
      this.showToast(`🖼️ Art moved to ${wall === 'back' ? 'Back' : (wall === 'left' ? 'Left' : 'Right')} Wall`);
    });

    slideSlider?.addEventListener('input', (e) => {
      if (!this.selectedRoot || (!this.selectedRoot.userData?.isWallMounted && this.selectedRoot.userData?.type !== 'wall_art')) return;
      const val = parseFloat(e.target.value);
      if (slideVal) slideVal.textContent = `${val >= 0 ? '+' : ''}${val.toFixed(2)}m`;
      const info = this.getWallArtInfo(this.selectedRoot);
      this.setWallArtPlacement(this.selectedRoot, info ? info.wall : 'back', val, info ? info.height : 1.8);
      this.syncWallArtSetupTab();
    });

    heightSlider?.addEventListener('input', (e) => {
      if (!this.selectedRoot || (!this.selectedRoot.userData?.isWallMounted && this.selectedRoot.userData?.type !== 'wall_art')) return;
      const val = parseFloat(e.target.value);
      if (heightVal) heightVal.textContent = `${val.toFixed(2)}m`;
      this.selectedRoot.position.y = val;
      this.syncWallArtSetupTab();
      if (this.selectionHelper) this.selectionHelper.update();
    });

    wSlider?.addEventListener('input', (e) => {
      if (!this.selectedRoot || (!this.selectedRoot.userData?.isWallMounted && this.selectedRoot.userData?.type !== 'wall_art')) return;
      const w = parseFloat(e.target.value);
      const h = parseFloat(hSlider ? hSlider.value : 0.9);
      if (wVal) wVal.textContent = `${w.toFixed(1)}m`;
      FurnitureFactory.updateWallArtDimensions(this.selectedRoot, w, h);
      this.syncWallArtSetupTab();
      if (this.selectionHelper) this.selectionHelper.update();
    });

    hSlider?.addEventListener('input', (e) => {
      if (!this.selectedRoot || (!this.selectedRoot.userData?.isWallMounted && this.selectedRoot.userData?.type !== 'wall_art')) return;
      const h = parseFloat(e.target.value);
      const w = parseFloat(wSlider ? wSlider.value : 1.2);
      if (hVal) hVal.textContent = `${h.toFixed(1)}m`;
      FurnitureFactory.updateWallArtDimensions(this.selectedRoot, w, h);
      this.syncWallArtSetupTab();
      if (this.selectionHelper) this.selectionHelper.update();
    });

    themeSelect?.addEventListener('change', (e) => {
      if (!this.selectedRoot || (!this.selectedRoot.userData?.isWallMounted && this.selectedRoot.userData?.type !== 'wall_art')) return;
      const theme = e.target.value;
      FurnitureFactory.updateWallArtTheme(this.selectedRoot, theme);
      this.syncWallArtSetupTab();
      this.showToast(`Artwork theme updated: ${e.target.options[e.target.selectedIndex].text}`);
    });

    document.querySelectorAll('.btn-frame-swatch').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!this.selectedRoot || (!this.selectedRoot.userData?.isWallMounted && this.selectedRoot.userData?.type !== 'wall_art')) return;
        const color = btn.dataset.frameColor;
        FurnitureFactory.updateWallArtFrameColor(this.selectedRoot, color);
        this.showToast(`Frame finish updated: ${btn.title}`);
      });
    });

    // --- SETUP TAB WALL ART CONTROLS ---
    const setupWall = document.getElementById('setup-art-wall-select');
    const setupPill = document.getElementById('setup-art-status-pill');
    const setupSlide = document.getElementById('setup-art-pos-slider');
    const setupSlideVal = document.getElementById('setup-art-pos-val');
    const setupHeight = document.getElementById('setup-art-height-slider');
    const setupHeightVal = document.getElementById('setup-art-height-val');
    const setupTheme = document.getElementById('setup-art-theme-select');
    const setupW = document.getElementById('setup-art-w-slider');
    const setupWVal = document.getElementById('setup-art-w-val');
    const setupH = document.getElementById('setup-art-h-slider');
    const setupHVal = document.getElementById('setup-art-h-val');

    setupWall?.addEventListener('change', (e) => {
      const art = this.getOrCreateWallArt();
      const wall = e.target.value;
      const info = this.getWallArtInfo(art);
      this.setWallArtPlacement(art, wall, info ? info.slide : 0, info ? info.height : 1.8);
      const wallName = e.target.options[e.target.selectedIndex].text;
      if (setupPill) setupPill.textContent = wallName;
      if (this.selectedRoot === art) this.syncWallArtInspector();
      this.showToast(`🖼️ Art placed on ${wallName}`);
    });

    setupSlide?.addEventListener('input', (e) => {
      const art = this.getOrCreateWallArt();
      const val = parseFloat(e.target.value);
      if (setupSlideVal) setupSlideVal.textContent = `${val >= 0 ? '+' : ''}${val.toFixed(1)}m`;
      const info = this.getWallArtInfo(art);
      this.setWallArtPlacement(art, info ? info.wall : 'back', val, info ? info.height : 1.8);
      if (this.selectedRoot === art) this.syncWallArtInspector();
    });

    setupHeight?.addEventListener('input', (e) => {
      const art = this.getOrCreateWallArt();
      const val = parseFloat(e.target.value);
      if (setupHeightVal) setupHeightVal.textContent = `${val.toFixed(2)}m`;
      art.position.y = val;
      if (this.selectedRoot === art) this.syncWallArtInspector();
      if (this.selectionHelper && this.selectedTarget === art) this.selectionHelper.update();
    });

    setupTheme?.addEventListener('change', (e) => {
      const art = this.getOrCreateWallArt();
      const theme = e.target.value;
      FurnitureFactory.updateWallArtTheme(art, theme);
      if (this.selectedRoot === art) this.syncWallArtInspector();
      this.showToast(`Artwork theme: ${e.target.options[e.target.selectedIndex].text}`);
    });

    setupW?.addEventListener('input', (e) => {
      const art = this.getOrCreateWallArt();
      const w = parseFloat(e.target.value);
      const h = parseFloat(setupH ? setupH.value : 0.9);
      if (setupWVal) setupWVal.textContent = `${w.toFixed(1)}m`;
      FurnitureFactory.updateWallArtDimensions(art, w, h);
      if (this.selectedRoot === art) this.syncWallArtInspector();
      if (this.selectionHelper && this.selectedTarget === art) this.selectionHelper.update();
    });

    setupH?.addEventListener('input', (e) => {
      const art = this.getOrCreateWallArt();
      const h = parseFloat(e.target.value);
      const w = parseFloat(setupW ? setupW.value : 1.2);
      if (setupHVal) setupHVal.textContent = `${h.toFixed(1)}m`;
      FurnitureFactory.updateWallArtDimensions(art, w, h);
      if (this.selectedRoot === art) this.syncWallArtInspector();
      if (this.selectionHelper && this.selectedTarget === art) this.selectionHelper.update();
    });
  }

  // 4b-iii. SINGLE WALL & ALL WALLS PAINT & ACCENT CUSTOMIZER
  initWallColorControls() {
    const designerAccents = [
      '#FFFFFF', '#F5F5F0', '#E8DFD8', '#A3B19B',
      '#B85D43', '#D8A49B', '#1E293B', '#1F242D',
      '#354F42', '#A5B4C4', '#C5BCB3', '#C8963E',
      '#2B3A42', '#3D405B', '#81B29A', '#E07A5F'
    ];

    // --- SETUP TAB WALL CONTROLS ---
    const setupTarget = document.getElementById('setup-wall-target-select');
    const setupPill = document.getElementById('setup-wall-status-pill');
    const setupColor = document.getElementById('setup-single-wall-color');
    const btnRandomSetup = document.getElementById('btn-random-wall-accent');

    const updateSetupColorValue = () => {
      const target = setupTarget ? setupTarget.value : 'all';
      const key = (target === 'all') ? 'back' : target;
      const hex = this.roomBuilder.getWallColor(key);
      if (setupColor) setupColor.value = hex.toLowerCase();
      document.querySelectorAll('.wall-swatch').forEach(b => {
        b.classList.toggle('active', b.dataset.color.toUpperCase() === hex.toUpperCase());
      });
    };

    setupTarget?.addEventListener('change', (e) => {
      const target = e.target.value;
      const targetName = e.target.options[e.target.selectedIndex].text;
      if (setupPill) setupPill.textContent = target === 'all' ? 'All Walls' : targetName.split(' ')[0] + ' Wall';
      updateSetupColorValue();
    });

    setupColor?.addEventListener('input', (e) => {
      const target = setupTarget ? setupTarget.value : 'all';
      const hex = parseInt(e.target.value.replace('#', '0x'), 16);
      this.roomBuilder.setSingleWallColor(target, hex);
      if (this.selectedWall) this.syncWallInspector(this.selectedWall);
    });

    btnRandomSetup?.addEventListener('click', () => {
      const randomColor = designerAccents[Math.floor(Math.random() * designerAccents.length)];
      const target = setupTarget ? setupTarget.value : 'all';
      const hex = parseInt(randomColor.replace('#', '0x'), 16);
      this.roomBuilder.setSingleWallColor(target, hex);
      if (setupColor) setupColor.value = randomColor.toLowerCase();
      if (this.selectedWall) this.syncWallInspector(this.selectedWall);
      const targetName = setupTarget?.options[setupTarget.selectedIndex]?.text || 'wall';
      this.showToast(`Applied accent ${randomColor} to ${targetName}`);
    });

    document.querySelectorAll('.wall-swatch').forEach(btn => {
      btn.addEventListener('click', () => {
        const color = btn.dataset.color;
        const target = setupTarget ? setupTarget.value : 'all';
        const hex = parseInt(color.replace('#', '0x'), 16);
        this.roomBuilder.setSingleWallColor(target, hex);
        if (setupColor) setupColor.value = color.toLowerCase();
        document.querySelectorAll('.wall-swatch').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (this.selectedWall) this.syncWallInspector(this.selectedWall);
        const targetName = setupTarget?.options[setupTarget.selectedIndex]?.text || 'wall';
        this.showToast(`Applied ${btn.title || color} to ${targetName}`);
      });
    });

    // --- CATALOG TAB SURFACE CONTROLS ---
    const catalogTarget = document.getElementById('catalog-wall-target-select');
    const catalogColor = document.getElementById('wall-color-picker');

    catalogTarget?.addEventListener('change', (e) => {
      const target = e.target.value;
      const key = (target === 'all') ? 'back' : target;
      const hex = this.roomBuilder.getWallColor(key);
      if (catalogColor) catalogColor.value = hex.toLowerCase();
    });

    catalogColor?.addEventListener('input', (e) => {
      const target = catalogTarget ? catalogTarget.value : 'all';
      const hex = parseInt(e.target.value.replace('#', '0x'), 16);
      this.roomBuilder.setSingleWallColor(target, hex);
      if (this.selectedWall) this.syncWallInspector(this.selectedWall);
      updateSetupColorValue();
    });

    // --- INSPECTOR POPUP WALL CONTROLS ---
    const inspectTarget = document.getElementById('inspector-wall-target-select');
    const inspectColor = document.getElementById('inspector-wall-color-picker');
    const btnRandomInspect = document.getElementById('btn-random-single-wall');

    const applyInspectorWallColor = (hexStr) => {
      const hex = parseInt(hexStr.replace('#', '0x'), 16);
      let target = inspectTarget ? inspectTarget.value : 'current';
      if (target === 'current' && this.selectedWall) {
        target = this.selectedWall.userData.wallKey || 'back';
      }
      this.roomBuilder.setSingleWallColor(target, hex);
      this.syncWallInspector(this.selectedWall);
      updateSetupColorValue();
    };

    inspectColor?.addEventListener('input', (e) => {
      applyInspectorWallColor(e.target.value);
    });

    btnRandomInspect?.addEventListener('click', () => {
      const randomColor = designerAccents[Math.floor(Math.random() * designerAccents.length)];
      applyInspectorWallColor(randomColor);
      this.showToast(`Applied accent ${randomColor}`);
    });

    document.querySelectorAll('.wall-swatch-inspect').forEach(btn => {
      btn.addEventListener('click', () => {
        applyInspectorWallColor(btn.dataset.color);
        this.showToast(`Applied ${btn.title || btn.dataset.color}`);
      });
    });
  }

  initArchitecturalControls() {
    // Window Controls
    const winWall = document.getElementById('window-wall-select');
    const winPos = document.getElementById('window-pos-slider');
    const winPosVal = document.getElementById('window-pos-val');
    const winW = document.getElementById('window-w-slider');
    const winWVal = document.getElementById('window-w-val');
    const winH = document.getElementById('window-h-slider');
    const winHVal = document.getElementById('window-h-val');
    const winPill = document.getElementById('window-status-pill');

    winWall?.addEventListener('change', (e) => {
      this.roomBuilder.updateWindow({ wall: e.target.value });
      if (winPill) {
        winPill.textContent = e.target.options[e.target.selectedIndex].text;
      }
      this.showToast(`Window moved to ${e.target.options[e.target.selectedIndex].text}`);
    });

    winPos?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (winPosVal) winPosVal.textContent = `${val >= 0 ? '+' : ''}${val.toFixed(1)}m`;
      this.roomBuilder.updateWindow({ offset: val });
    });

    winW?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (winWVal) winWVal.textContent = `${val.toFixed(1)}m`;
      this.roomBuilder.updateWindow({ width: val });
    });

    winH?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (winHVal) winHVal.textContent = `${val.toFixed(1)}m`;
      this.roomBuilder.updateWindow({ height: val });
    });

    // Door Controls
    const doorWall = document.getElementById('door-wall-select');
    const doorPos = document.getElementById('door-pos-slider');
    const doorPosVal = document.getElementById('door-pos-val');
    const doorW = document.getElementById('door-w-slider');
    const doorWVal = document.getElementById('door-w-val');
    const doorSwing = document.getElementById('door-swing-slider');
    const doorSwingVal = document.getElementById('door-swing-val');
    const doorPill = document.getElementById('door-status-pill');

    doorWall?.addEventListener('change', (e) => {
      this.roomBuilder.updateDoor({ wall: e.target.value });
      if (doorPill) {
        doorPill.textContent = e.target.options[e.target.selectedIndex].text;
      }
      this.showToast(`Door moved to ${e.target.options[e.target.selectedIndex].text}`);
    });

    doorPos?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (doorPosVal) doorPosVal.textContent = `${val >= 0 ? '+' : ''}${val.toFixed(1)}m`;
      this.roomBuilder.updateDoor({ offset: val });
    });

    doorW?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (doorWVal) doorWVal.textContent = `${val.toFixed(2)}m`;
      this.roomBuilder.updateDoor({ width: val });
    });

    doorSwing?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (doorSwingVal) doorSwingVal.textContent = `${val}°`;
      this.roomBuilder.setDoorSwing(val);
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
      lighting: 'warm_ambient',
      customNotes: ''
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
      const colHex = designPlan.palette?.wallColorHex || ('#' + Number(designPlan.wallColorHex).toString(16).padStart(6, '0'));
      const wallPicker = document.getElementById('wall-color-picker');
      if (wallPicker) wallPicker.value = colHex;
      const setupColor = document.getElementById('setup-single-wall-color');
      if (setupColor) setupColor.value = colHex;
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
    const budgetEl = document.getElementById('ai-total-budget');
    if (budgetEl) budgetEl.textContent = '';

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

    // Items Checklist (Display item name and placement category without costs)
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
        <span class="badge" style="background: rgba(99, 102, 241, 0.2); color: #a5b4fc; text-transform: capitalize;">${(item.type || 'fixture').replace('_', ' ')}</span>
      `;
      checklist.appendChild(row);
    });

    this.syncWallArtSetupTab();
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
        meshGroup = FurnitureFactory.createWallArt(
          style,
          itemData.artTheme || 'geometric',
          itemData.artWidth || 1.2,
          itemData.artHeight || 0.9,
          itemData.frameColor
        );
        break;
      case 'rug':
        const [w, l] = itemData.dimensions || [2.4, 1.8];
        meshGroup = FurnitureFactory.createRug(w, l, style);
        break;
      case 'wardrobe':
        meshGroup = FurnitureFactory.createWardrobe(style, itemData.color);
        break;
      case 'mirrored_wardrobe':
        meshGroup = FurnitureFactory.createMirroredWardrobe(style, itemData.color);
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
      case 'kitchen_cabinets':
        meshGroup = FurnitureFactory.createKitchenCabinets(style, itemData.color);
        break;
      case 'kitchen_island':
        meshGroup = FurnitureFactory.createKitchenIsland(style, itemData.color);
        break;
      case 'refrigerator':
        meshGroup = FurnitureFactory.createRefrigerator(style);
        break;
      case 'kitchen_range':
        meshGroup = FurnitureFactory.createKitchenRange(style);
        break;
      case 'bar_stool':
        meshGroup = FurnitureFactory.createBarStool(style, itemData.color, itemData.stoolIndex || 1);
        break;
      default:
        meshGroup = FurnitureFactory.createCoffeeTable(style);
        break;
    }

    if (meshGroup) {
      if (itemData.position) meshGroup.position.set(...itemData.position);
      if (itemData.rotation) meshGroup.rotation.set(...itemData.rotation);
      if (itemData.name) meshGroup.name = itemData.name;
      meshGroup.userData = { ...meshGroup.userData, ...itemData };
      this.furnitureGroup.add(meshGroup);
      if (itemData.type === 'wall_art') {
        this.syncWallArtSetupTab();
      }
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

    const conceptTitle = `${this.currentStyle.toUpperCase()} Interior Layout`;
    const roomType = document.getElementById('room-type')?.value || 'living_room';
    const roomTypeLabel = roomType.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
    const w = parseFloat(document.getElementById('room-w')?.value) || 5.0;
    const l = parseFloat(document.getElementById('room-l')?.value) || 4.5;
    const h = parseFloat(document.getElementById('room-h')?.value) || 2.8;
    const areaSqM = (w * l).toFixed(1);
    const areaSqFt = ((w * l) * 10.7639).toFixed(0);
    const flooring = document.getElementById('flooring-select')?.value || 'wood_oak';
    const flooringLabel = flooring.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
    const lighting = 'warm_ambient';
    const lightingLabel = 'Warm Ambient';
    const wallColor = document.getElementById('wall-color-picker')?.value || '#faf5ee';

    // Schedule of all placed furniture
    const itemsList = this.furnitureGroup.children.map((child, idx) => {
      return {
        id: idx + 1,
        name: child.name || child.userData?.name || 'Furniture Item',
        type: (child.userData?.type || 'furniture').replace('_', ' '),
        posX: child.position.x.toFixed(2),
        posZ: child.position.z.toFixed(2)
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
            <tr><td>Design Concept</td><td>${conceptTitle}</td></tr>
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
        </div>
        <table class="report-items-table">
          <thead>
            <tr>
              <th style="width: 40px;">#</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Room Coordinates (X, Z)</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList.map(item => `
              <tr>
                <td>${item.id}</td>
                <td><strong>${item.name}</strong></td>
                <td style="text-transform: capitalize;">${item.type}</td>
                <td>X: ${item.posX}m, Z: ${item.posZ}m</td>
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

    // Save as new design
    document.getElementById('btn-save-as-new')?.addEventListener('click', () => {
      const name = document.getElementById('project-name-input')?.value?.trim() || 'My Interior Design';
      this.saveProject(name);
    });

    document.getElementById('btn-save-project')?.addEventListener('click', () => {
      const name = document.getElementById('project-name-input')?.value?.trim() || 'My Interior Design';
      this.saveProject(name);
    });

    // Import JSON
    const fileInput = document.getElementById('file-import-json');
    document.getElementById('btn-trigger-import')?.addEventListener('click', () => {
      fileInput?.click();
    });
    fileInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          this.loadProjectData(data);
          this.showToast('Imported design successfully!');
        } catch (err) {
          this.showToast('Failed to parse JSON file');
        }
      };
      reader.readAsText(file);
    });
  }

  getCurrentProjectData() {
    return {
      name: document.getElementById('project-name-input')?.value || 'My Interior Design',
      roomType: document.getElementById('room-type')?.value || 'living_room',
      dimensions: {
        width: parseFloat(document.getElementById('room-w')?.value) || 5.0,
        length: parseFloat(document.getElementById('room-l')?.value) || 4.5,
        height: parseFloat(document.getElementById('room-h')?.value) || 2.8
      },
      style: this.currentStyle,
      colorScheme: document.getElementById('color-scheme')?.value || 'warm_neutral',
      flooring: document.getElementById('flooring-select')?.value || 'wood_oak',
      lighting: 'warm_ambient',
      wallColor: this.roomBuilder?.getWallColor('back') || '#faf5ee',
      singleWallColors: {
        back: this.roomBuilder?.getWallColor('back'),
        left: this.roomBuilder?.getWallColor('left'),
        right: this.roomBuilder?.getWallColor('right')
      },
      furniture: this.furnitureGroup.children.map(child => ({
        type: child.userData?.type || 'furniture',
        name: child.name,
        position: [child.position.x, child.position.y, child.position.z],
        rotation: [child.rotation.x, child.rotation.y, child.rotation.z]
      }))
    };
  }

  saveProject(name) {
    const projects = JSON.parse(localStorage.getItem('ai_interior_projects') || '{}');
    projects[name] = this.getCurrentProjectData();
    localStorage.setItem('ai_interior_projects', JSON.stringify(projects));
    this.renderSavedProjectsList();
    this.showToast(`Saved design: "${name}"`);
  }

  renderSavedProjectsList() {
    const container = document.getElementById('saved-projects-list');
    if (!container) return;
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
    if (data.singleWallColors) {
      if (data.singleWallColors.back) this.roomBuilder.setSingleWallColor('back', parseInt(data.singleWallColors.back.replace('#', '0x'), 16));
      if (data.singleWallColors.left) this.roomBuilder.setSingleWallColor('left', parseInt(data.singleWallColors.left.replace('#', '0x'), 16));
      if (data.singleWallColors.right) this.roomBuilder.setSingleWallColor('right', parseInt(data.singleWallColors.right.replace('#', '0x'), 16));
    } else if (data.wallColor) {
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
