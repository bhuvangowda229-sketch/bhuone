// AI Interior Studio - Application Coordinator
import { RoomBuilder } from './room-model.js';
import { FurnitureFactory } from './furniture-models.js';
import { AIEngine } from './ai-engine.js';

class App {
  constructor() {
    // Authentication Guard & Guest Auto-Init
    try {
      const stored = localStorage.getItem('ai_interior_user');
      if (!stored) {
        const guestUser = {
          id: 'guest_' + Date.now(),
          name: 'Guest Designer',
          email: 'guest@aiinterior.local',
          role: 'user',
          loginTime: new Date().toISOString()
        };
        localStorage.setItem('ai_interior_user', JSON.stringify(guestUser));
      }
    } catch (e) {
      console.warn('LocalStorage unavailable in current environment:', e);
    }

    this.canvas = document.getElementById('canvas3d');
    if (!this.canvas) return;
    window.appInstance = this;
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

    // Complete House Multi-Room Navigation & State
    this.currentHouseZone = 'all';
    this.currentHouseType = '1bhk'; // '1bhk' (Single Bedroom House) or '2bhk' (Double Bedroom House)
    this.currentHouseRoomTypes = { living: 1, dining: 1, kitchen: 1, bedroom: 1, dressing: 1 };
    this.cameraAnimation = null;

    // Sun Study & Solar Daylighting Simulation State
    this.currentSunHour = 10.0;
    // Laser Tape Measurement State
    this.isMeasuring = false;
    this.measureStartPoint = null;
    this.measureMarkers = [];
    this.measureLines = [];
    this.measureSprites = [];
    this.tempMeasureLine = null;
    // Room Area Schedule State
    this.scheduleUnit = 'metric';
    this.show3DAreaBadges = false;

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
    // Ambient light - warm balanced illumination
    this.ambientLight = new THREE.AmbientLight(0xfff6ec, 0.65);
    this.scene.add(this.ambientLight);

    // Sun / Natural Morning Directional Light with full-villa shadow coverage
    this.sunLight = new THREE.DirectionalLight(0xfffaed, 1.25);
    this.sunLight.position.set(-12, 16, 10);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 42;
    this.sunLight.shadow.camera.left = -16;
    this.sunLight.shadow.camera.right = 16;
    this.sunLight.shadow.camera.top = 16;
    this.sunLight.shadow.camera.bottom = -16;
    this.sunLight.shadow.bias = -0.0003;
    this.scene.add(this.sunLight);

    // Soft ceiling fill light
    this.ceilingLight = new THREE.PointLight(0xfff7ed, 0.6, 25, 1.5);
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

      // In Laser Measurement mode, route click to laser tape logic
      if (this.isMeasuring) {
        this.handleMeasureClick(e);
        return;
      }

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
            const doorPill = document.getElementById('door-status-pill');
            if (doorPill) {
              doorPill.textContent = nextSwing === 0 ? '🔒 Closed (0°)' : (nextSwing >= 75 ? `✨ Open (${nextSwing}°)` : `🚪 Ajar (${nextSwing}°)`);
            }
            this.showToast(nextSwing > 0 ? `✨ Entry Door opened (${nextSwing}°)` : '🔒 Entry Door closed (0°)');
          }
        }
        return;
      }

      const interactiveTargets = [
        ...this.furnitureGroup.children,
        ...(this.roomBuilder.windowGroup ? [this.roomBuilder.windowGroup] : []),
        ...(this.roomBuilder.doorGroup ? [this.roomBuilder.doorGroup] : []),
        ...(this.roomBuilder.roomBadges || [])
      ];
      const intersects = this.raycaster.intersectObjects(interactiveTargets, true);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;

        // Check if clicked 3D Room Badge
        if (clickedMesh.userData && clickedMesh.userData.isRoomBadge) {
          this.focusRoom(clickedMesh.userData.roomZone);
          return;
        }

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
          const doorPill = document.getElementById('door-status-pill');
          if (doorPill) {
            doorPill.textContent = nextSwing === 0 ? '🔒 Closed (0°)' : (nextSwing >= 75 ? `✨ Open (${nextSwing}°)` : `🚪 Ajar (${nextSwing}°)`);
          }
          this.showToast(nextSwing > 0 ? `✨ Entry Door opened (${nextSwing}°)` : '🔒 Entry Door closed (0°)');
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
      // In Laser Measurement mode, route hover move to live measurement preview
      if (this.isMeasuring) {
        this.handleMeasureMove(e);
        return;
      }

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

    const isWallArt = this.selectedRoot?.userData?.type === 'wall_art';
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

    // Missouri TV Entertainment Unit Design Switcher Panel
    const isMissouriTV = this.selectedRoot?.userData?.type === 'missouri_tv_unit';
    const tvPanel = document.getElementById('inspector-tv-panel');
    if (tvPanel) {
      tvPanel.style.display = isMissouriTV ? 'block' : 'none';
      if (isMissouriTV) {
        const currentDesign = this.selectedRoot?.userData?.design || 1;
        const badge = document.getElementById('tv-design-badge');
        if (badge) badge.textContent = `Design ${currentDesign}`;
        document.querySelectorAll('.tv-design-btn').forEach(b => {
          b.classList.toggle('active', parseInt(b.dataset.design, 10) === currentDesign);
        });
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

    if (this.selectedRoot?.userData?.type === 'wall_art') {
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

    const isWallArt = this.selectedRoot?.userData?.type === 'wall_art';
    if (isWallArt) {
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
    if (!this.selectedRoot || this.selectedRoot.userData?.type !== 'wall_art') return;
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

    // Complete House Navigator Bar buttons (Whole House, Living, Dining, Kitchen, Bedroom, Bed 2 / Dressing)
    document.querySelectorAll('.house-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const roomSelect = document.getElementById('room-type');
        const currentVal = roomSelect ? roomSelect.value : '';
        const isAlreadyHouse = currentVal === 'complete_house' || currentVal === 'complete_house_2bhk' || currentVal === 'complete_house_3bhk' || currentVal === 'duplex';
        if (roomSelect && !isAlreadyHouse) {
          let targetHouseVal = 'complete_house';
          if (this.currentHouseType === 'duplex') targetHouseVal = 'duplex';
          else if (this.currentHouseType === '3bhk') targetHouseVal = 'complete_house_3bhk';
          else if (this.currentHouseType === '2bhk') targetHouseVal = 'complete_house_2bhk';
          roomSelect.value = targetHouseVal;
          this.syncRoomVariantsUI(targetHouseVal);
          this.triggerAIGeneration().then(() => {
            this.focusRoom(btn.dataset.targetRoom);
          });
        } else {
          this.focusRoom(btn.dataset.targetRoom);
        }
      });
    });

    // Complete House Zone Hub buttons in sidebar
    document.querySelectorAll('.house-zone-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const roomSelect = document.getElementById('room-type');
        const currentVal = roomSelect ? roomSelect.value : '';
        const isAlreadyHouse = currentVal === 'complete_house' || currentVal === 'complete_house_2bhk' || currentVal === 'complete_house_3bhk' || currentVal === 'duplex';
        if (roomSelect && !isAlreadyHouse) {
          let targetHouseVal = 'complete_house';
          if (this.currentHouseType === 'duplex') targetHouseVal = 'duplex';
          else if (this.currentHouseType === '3bhk') targetHouseVal = 'complete_house_3bhk';
          else if (this.currentHouseType === '2bhk') targetHouseVal = 'complete_house_2bhk';
          roomSelect.value = targetHouseVal;
          this.syncRoomVariantsUI(targetHouseVal);
          this.triggerAIGeneration().then(() => {
            this.focusRoom(btn.dataset.zone);
          });
        } else {
          this.focusRoom(btn.dataset.zone);
        }
      });
    });

    // 1 BHK vs 2 BHK vs 3 BHK vs Duplex House Toggle Pills
    document.querySelectorAll('.house-type-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const hType = btn.getAttribute('data-house-type') || '1bhk';
        this.currentHouseType = hType;
        let targetVal = 'complete_house';
        if (hType === 'duplex') targetVal = 'duplex';
        else if (hType === '3bhk') targetVal = 'complete_house_3bhk';
        else if (hType === '2bhk') targetVal = 'complete_house_2bhk';

        const roomSelect = document.getElementById('room-type');
        if (roomSelect) {
          roomSelect.value = targetVal;
        }
        this.syncRoomVariantsUI(targetVal);
        this.triggerAIGeneration();
        if (hType === 'duplex') {
          this.showToast('🏙️ Switched to Modern Duplex Villa (Double-Height Living & Mezzanine)');
        } else if (hType === '3bhk') {
          this.showToast('🏰 Switched to Luxury 3 BHK Residence (10 Connected Spaces & Balcony)');
        } else if (hType === '2bhk') {
          this.showToast('🏛️ Switched to Architectural 2 BHK Residence');
        } else {
          this.showToast('🏠 Switched to Single Bedroom House (1 BHK)');
        }
      });
    });

    // Instant Room Type Switching
    document.getElementById('room-type')?.addEventListener('change', (e) => {
      const selectedType = e.target.value;
      if (selectedType === 'complete_house') this.currentHouseType = '1bhk';
      else if (selectedType === 'complete_house_2bhk') this.currentHouseType = '2bhk';
      else if (selectedType === 'complete_house_3bhk') this.currentHouseType = '3bhk';
      else if (selectedType === 'duplex') this.currentHouseType = 'duplex';
      this.syncRoomVariantsUI(selectedType);
      this.triggerAIGeneration();
      const rName = e.target.options[e.target.selectedIndex]?.text || 'Space';
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

    // Daylight & Warm 3000K Lighting Mode Cycle
    this.lightingModeIndex = 0;
    const lightingModes = [
      { id: 'morning_3000k', label: '☀️ 3000K Morning', toast: 'Warm 3000K interior lighting & natural morning daylight enabled', bg: 0x0a0e17, ambColor: 0xfff3e3, ambInt: 0.62, sunColor: 0xffebd2, sunInt: 1.30, sunPos: [-9, 6.2, 5.2], ceilColor: 0xffdfba, ceilInt: 0.70 },
      { id: 'midday_day', label: '🌤️ Midday Daylight', toast: 'Bright midday daylight simulation enabled', bg: 0x0f172a, ambColor: 0xffffff, ambInt: 0.55, sunColor: 0xfffaed, sunInt: 1.20, sunPos: [-8, 9.0, 4.0], ceilColor: 0xfff7ed, ceilInt: 0.55 },
      { id: 'evening_moody', label: '🌙 Evening Warm', toast: 'Moody evening lighting & warm LEDs enabled', bg: 0x020408, ambColor: 0xffe2c4, ambInt: 0.18, sunColor: 0xff8c42, sunInt: 0.08, sunPos: [-10, 3.0, 6.0], ceilColor: 0xffb770, ceilInt: 1.35 }
    ];

    const daylightBtn = document.getElementById('btn-toggle-daylight');
    if (daylightBtn) {
      daylightBtn.innerHTML = '☀️ 3000K Morning';
      daylightBtn.addEventListener('click', () => {
        this.lightingModeIndex = (this.lightingModeIndex + 1) % lightingModes.length;
        const mode = lightingModes[this.lightingModeIndex];
        daylightBtn.innerHTML = mode.label;
        daylightBtn.classList.toggle('active', mode.id !== 'evening_moody');

        this.scene.background.set(mode.bg);
        this.ambientLight.color.setHex(mode.ambColor);
        this.ambientLight.intensity = mode.ambInt;
        this.sunLight.color.setHex(mode.sunColor);
        this.sunLight.intensity = mode.sunInt;
        this.sunLight.position.set(mode.sunPos[0], mode.sunPos[1], mode.sunPos[2]);
        this.ceilingLight.color.setHex(mode.ceilColor);
        this.ceilingLight.intensity = mode.ceilInt;

        this.showToast(mode.toast);
      });
    }

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

    // Missouri TV Entertainment Unit Design Switcher
    document.querySelectorAll('.tv-design-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!this.selectedRoot || this.selectedRoot.userData?.type !== 'missouri_tv_unit') return;
        const targetDesign = parseInt(btn.dataset.design, 10) || 1;
        const pos = this.selectedRoot.position.clone();
        const rot = this.selectedRoot.rotation.clone();
        const col = this.selectedRoot.userData?.color || null;

        this.furnitureGroup.remove(this.selectedRoot);

        const newUnit = FurnitureFactory.createMissouriTVUnit(this.currentStyle, col, targetDesign);
        newUnit.position.copy(pos);
        newUnit.rotation.copy(rot);
        this.furnitureGroup.add(newUnit);

        this.selectTarget(newUnit, newUnit);
        this.updateTargetByMode();
        this.showToast(`Switched to ${newUnit.name}`);
      });
    });

    // Add items from catalog
    document.querySelectorAll('.add-catalog-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        const isWall = type === 'wall_art' || type === 'wall_clock' || type === 'air_conditioner' || type === 'curtains' || type === 'water_purifier';
        const isCeiling = type === 'ceiling_fan' || type === 'pendant_light';
        const halfL = (this.currentRoomDimensions?.length || 4.5) / 2;

        let initialPos = [0, 0, 0];
        let initialRot = [0, 0, 0];
        if (isWall) {
          const wallY = type === 'air_conditioner' ? 2.3 : (type === 'curtains' ? 1.1 : (type === 'wall_clock' ? 2.0 : (type === 'water_purifier' ? 1.6 : 1.85)));
          initialPos = [0, wallY, -halfL + 0.04];
        } else if (isCeiling) {
          initialPos = [0, 0, 0];
        } else if (type === 'missouri_tv_unit' || type === 'tv_unit') {
          initialPos = [0, 0, halfL - 0.45];
          initialRot = [0, Math.PI, 0];
        }

        const itemName = btn.textContent.trim();
        const variant = btn.dataset.variant ? parseInt(btn.dataset.variant, 10) : 1;
        this.addFurnitureItem({
          type: type,
          name: itemName,
          style: this.currentStyle,
          position: initialPos,
          rotation: initialRot,
          design: variant
        });

        if (isWall) {
          this.showToast(`🧱 Added ${itemName} to Back Wall`);
        } else if (isCeiling) {
          this.showToast(`💡 Added ${itemName} to Ceiling`);
        } else {
          this.showToast(`✨ Added ${itemName} to room`);
        }
      });
    });

    // Real-time Catalog Search & Category Filter
    const catSearch = document.getElementById('catalog-search');
    const catPills = document.querySelectorAll('.catalog-filter-pill');
    let activeCategory = 'all';

    const filterCatalog = () => {
      const q = (catSearch?.value || '').toLowerCase().trim();
      document.querySelectorAll('.catalog-category-group').forEach(group => {
        const groupCat = group.dataset.category;
        const matchesCategory = activeCategory === 'all' || groupCat === activeCategory;
        let visibleCount = 0;

        group.querySelectorAll('.add-catalog-item').forEach(item => {
          const text = (item.textContent || '').toLowerCase();
          const matchesSearch = !q || text.includes(q);
          const show = matchesCategory && matchesSearch;
          item.classList.toggle('hidden', !show);
          item.style.display = show ? 'flex' : 'none';
          if (show) visibleCount++;
        });

        const showGroup = matchesCategory && visibleCount > 0;
        group.classList.toggle('hidden', !showGroup);
        group.style.display = showGroup ? 'block' : 'none';
      });
    };

    catSearch?.addEventListener('input', filterCatalog);

    catPills.forEach(pill => {
      pill.addEventListener('click', () => {
        catPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeCategory = pill.dataset.filter || 'all';
        filterCatalog();
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

    // Architectural 3D Renders Modal Handlers
    const rendersModal = document.getElementById('renders-modal');
    document.getElementById('btn-view-renders')?.addEventListener('click', () => {
      if (rendersModal) rendersModal.classList.add('open');
    });

    document.getElementById('btn-close-renders')?.addEventListener('click', () => {
      if (rendersModal) rendersModal.classList.remove('open');
    });

    const tabCutaway = document.getElementById('tab-render-cutaway');
    const tabTopdown = document.getElementById('tab-render-topdown');
    const tabEyelevel = document.getElementById('tab-render-eyelevel');
    const viewCutaway = document.getElementById('view-render-cutaway');
    const viewTopdown = document.getElementById('view-render-topdown');
    const viewEyelevel = document.getElementById('view-render-eyelevel');

    tabCutaway?.addEventListener('click', () => {
      tabCutaway.classList.add('active');
      tabTopdown?.classList.remove('active');
      tabEyelevel?.classList.remove('active');
      if (viewCutaway) viewCutaway.style.display = 'block';
      if (viewTopdown) viewTopdown.style.display = 'none';
      if (viewEyelevel) viewEyelevel.style.display = 'none';
    });

    tabTopdown?.addEventListener('click', () => {
      tabTopdown.classList.add('active');
      tabCutaway?.classList.remove('active');
      tabEyelevel?.classList.remove('active');
      if (viewTopdown) viewTopdown.style.display = 'block';
      if (viewCutaway) viewCutaway.style.display = 'none';
      if (viewEyelevel) viewEyelevel.style.display = 'none';
    });

    tabEyelevel?.addEventListener('click', () => {
      tabEyelevel.classList.add('active');
      tabCutaway?.classList.remove('active');
      tabTopdown?.classList.remove('active');
      if (viewEyelevel) viewEyelevel.style.display = 'block';
      if (viewCutaway) viewCutaway.style.display = 'none';
      if (viewTopdown) viewTopdown.style.display = 'none';
    });

    // 1-Click Load Presets from Renders Modal
    document.getElementById('btn-apply-3bhk-preset')?.addEventListener('click', () => {
      if (rendersModal) rendersModal.classList.remove('open');
      const roomSelect = document.getElementById('room-type');
      if (roomSelect) roomSelect.value = 'complete_house_3bhk';
      this.currentHouseType = '3bhk';
      this.syncRoomVariantsUI('complete_house_3bhk');
      this.triggerAIGeneration();
      this.setCameraPreset('3d');
      this.showToast('🏰 Loaded Luxury 3 BHK Residence Layout');
    });

    document.getElementById('btn-apply-duplex-preset')?.addEventListener('click', () => {
      if (rendersModal) rendersModal.classList.remove('open');
      const roomSelect = document.getElementById('room-type');
      if (roomSelect) roomSelect.value = 'duplex';
      this.currentHouseType = 'duplex';
      this.syncRoomVariantsUI('duplex');
      this.triggerAIGeneration();
      this.setCameraPreset('3d');
      this.showToast('🏙️ Loaded Modern Duplex Villa Layout');
    });

    // Studio Sign Out button
    document.getElementById('btn-studio-signout')?.addEventListener('click', () => {
      localStorage.removeItem('ai_interior_user');
      window.location.href = 'login.html?redirect=studio.html';
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

    // Initialize Sun Study, Measure Tool, Room Schedule, and Advanced Exports
    this.initSunStudy();
    this.initMeasureTool();
    this.initRoomSchedule();
    this.initExportTools();
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
    const doorFinish = document.getElementById('door-finish-select');
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

    doorFinish?.addEventListener('change', (e) => {
      this.roomBuilder.updateDoor({ finish: e.target.value });
      this.showToast(`Door finish changed to ${e.target.options[e.target.selectedIndex].text}`);
    });

    doorPos?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (doorPosVal) doorPosVal.textContent = `${val >= 0 ? '+' : ''}${val.toFixed(2)}m`;
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
      if (doorPill) {
        doorPill.textContent = val === 0 ? '🔒 Closed (0°)' : (val >= 75 ? `✨ Open (${val}°)` : `🚪 Ajar (${val}°)`);
      }
      this.roomBuilder.setDoorSwing(val);
    });

    document.querySelectorAll('.btn-door-quick-swing').forEach(btn => {
      btn.addEventListener('click', () => {
        const angle = parseInt(btn.dataset.angle, 10);
        this.roomBuilder.setDoorSwing(angle);
        if (doorSwing) doorSwing.value = angle;
        if (doorSwingVal) doorSwingVal.textContent = `${angle}°`;
        if (doorPill) {
          doorPill.textContent = angle === 0 ? '🔒 Closed (0°)' : (angle >= 75 ? `✨ Open (${angle}°)` : `🚪 Ajar (${angle}°)`);
        }
        this.showToast(angle === 0 ? '🔒 Door closed (0°)' : (angle >= 75 ? `✨ Door fully opened (${angle}°)` : `🚪 Door set ajar (${angle}°)`));
      });
    });

    this.syncRoomVariantsUI(document.getElementById('room-type')?.value || 'bedroom');
  }

  // Complete House Navigation & Active Room Synchronizer
  syncRoomVariantsUI(currentRoomType) {
    const isDuplex = (currentRoomType === 'duplex' || currentRoomType === 'duplex_villa' || this.currentHouseType === 'duplex');
    const is3BHK = (currentRoomType === 'complete_house_3bhk' || currentRoomType === '3bhk' || this.currentHouseType === '3bhk');
    const is2BHK = (currentRoomType === 'complete_house_2bhk' || this.currentHouseType === '2bhk');
    const isHouse = (currentRoomType === 'complete_house' || is2BHK || is3BHK || isDuplex);
    if (isHouse) {
      this.currentHouseType = isDuplex ? 'duplex' : (is3BHK ? '3bhk' : (is2BHK ? '2bhk' : '1bhk'));
    }
    const houseHub = document.getElementById('house-hub-wrapper');
    const houseNav = document.getElementById('house-navigator-bar');
    if (houseHub) houseHub.style.display = isHouse ? 'block' : 'none';
    if (houseNav) houseNav.style.display = isHouse ? 'flex' : 'none';

    // Synchronize Architectural Door UI
    const doorWall = document.getElementById('door-wall-select');
    const doorPos = document.getElementById('door-pos-slider');
    const doorPosVal = document.getElementById('door-pos-val');
    const doorW = document.getElementById('door-w-slider');
    const doorWVal = document.getElementById('door-w-val');
    const doorSwing = document.getElementById('door-swing-slider');
    const doorSwingVal = document.getElementById('door-swing-val');
    const doorPill = document.getElementById('door-status-pill');
    const doorFinish = document.getElementById('door-finish-select');

    if (isHouse) {
      if (doorWall) {
        doorWall.innerHTML = '<option value="front" selected>🚪 Foyer Front Entrance</option>';
        doorWall.disabled = true;
      }
      if (doorPos) {
        doorPos.min = "-0.35";
        doorPos.max = "0.35";
        doorPos.step = "0.05";
        doorPos.value = (this.roomBuilder?.doorConfig?.offset || 0).toString();
      }
      if (doorPosVal) {
        const off = this.roomBuilder?.doorConfig?.offset || 0;
        doorPosVal.textContent = `${off >= 0 ? '+' : ''}${off.toFixed(2)}m`;
      }
      if (doorW) {
        doorW.min = "0.85";
        doorW.max = "1.25";
        doorW.step = "0.05";
        doorW.value = (this.roomBuilder?.doorConfig?.width || 1.05).toString();
      }
      if (doorWVal) {
        doorWVal.textContent = `${(this.roomBuilder?.doorConfig?.width || 1.05).toFixed(2)}m`;
      }
    } else {
      if (doorWall) {
        doorWall.disabled = false;
        doorWall.innerHTML = `
          <option value="right"${this.roomBuilder?.doorConfig?.wall === 'right' ? ' selected' : ''}>Right Wall</option>
          <option value="back"${this.roomBuilder?.doorConfig?.wall === 'back' ? ' selected' : ''}>Back Wall</option>
          <option value="left"${this.roomBuilder?.doorConfig?.wall === 'left' ? ' selected' : ''}>Left Wall</option>
        `;
      }
      if (doorPos) {
        doorPos.min = "-2.0";
        doorPos.max = "2.0";
        doorPos.step = "0.1";
        doorPos.value = (this.roomBuilder?.doorConfig?.offset || 0).toString();
      }
      if (doorW) {
        doorW.min = "0.7";
        doorW.max = "1.3";
        doorW.step = "0.05";
        doorW.value = (this.roomBuilder?.doorConfig?.width || 0.9).toString();
      }
    }

    if (doorFinish && this.roomBuilder?.doorConfig?.finish) {
      doorFinish.value = this.roomBuilder.doorConfig.finish;
    }
    const currentAngle = this.roomBuilder?.doorConfig?.openAngle || 0;
    if (doorSwing) doorSwing.value = currentAngle;
    if (doorSwingVal) doorSwingVal.textContent = `${currentAngle}°`;
    if (doorPill) {
      doorPill.textContent = currentAngle === 0 ? '🔒 Closed (0°)' : (currentAngle >= 75 ? `✨ Open (${currentAngle}°)` : `🚪 Ajar (${currentAngle}°)`);
    }

    if (isHouse) {
      document.querySelectorAll('.house-type-toggle-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-house-type') === this.currentHouseType);
      });
      const housePill = document.getElementById('house-active-room-pill');
      if (housePill) {
        if (isDuplex) {
          housePill.textContent = 'Modern Duplex Villa Active';
        } else if (is3BHK) {
          housePill.textContent = 'Luxury 3 BHK Residence Active';
        } else if (is2BHK) {
          housePill.textContent = 'Architectural 2 BHK Residence Active';
        } else {
          housePill.textContent = 'Single Bedroom House (1 BHK) Active';
        }
      }

      // Hub & Nav elements
      const hubFoyerBtn = document.getElementById('hub-zone-foyer');
      const navFoyerBtn = document.getElementById('nav-btn-foyer');
      const hubRearBtn = document.getElementById('hub-zone-rear');
      const navRearBtn = document.getElementById('nav-btn-rear');
      const hubBed3Btn = document.getElementById('hub-zone-bed3');
      const navBed3Btn = document.getElementById('nav-btn-bed3');
      const hubBalconyBtn = document.getElementById('hub-zone-balcony');
      const navBalconyBtn = document.getElementById('nav-btn-balcony');
      const hubStaircaseBtn = document.getElementById('hub-zone-staircase');
      const navStairsBtn = document.getElementById('nav-btn-stairs');
      const hubMezzanineBtn = document.getElementById('hub-zone-mezzanine');
      const navMezzanineBtn = document.getElementById('nav-btn-mezzanine');
      const hubSkyLoungeBtn = document.getElementById('hub-zone-skylounge');
      const navSkyLoungeBtn = document.getElementById('nav-btn-sky-lounge');
      const hubTerraceBtn = document.getElementById('hub-zone-terrace');
      const hubBathBtn = document.getElementById('hub-zone-bath');
      const navBathBtn = document.getElementById('nav-btn-bath');
      const hubMasterBathBtn = document.getElementById('hub-zone-master-bath');
      const navMasterBathBtn = document.getElementById('nav-btn-master-bath');
      const navYardBtn = document.getElementById('nav-btn-yard');

      // Reset specific elements
      [hubBed3Btn, navBed3Btn, hubBalconyBtn, navBalconyBtn, hubStaircaseBtn, navStairsBtn, hubMezzanineBtn, navMezzanineBtn, hubSkyLoungeBtn, navSkyLoungeBtn, hubTerraceBtn].forEach(el => {
        if (el) el.style.display = 'none';
      });

      if (isDuplex) {
        if (hubFoyerBtn) hubFoyerBtn.style.display = 'inline-flex';
        if (navFoyerBtn) navFoyerBtn.style.display = 'inline-flex';
        if (hubRearBtn) {
          hubRearBtn.style.display = 'inline-flex';
          hubRearBtn.innerHTML = '👑 Penthouse (L2)';
          hubRearBtn.setAttribute('data-zone', 'bedroom2');
        }
        if (navRearBtn) {
          navRearBtn.style.display = 'inline-flex';
          navRearBtn.innerHTML = '<span>👑</span> Penthouse (L2)';
          navRearBtn.setAttribute('data-target-room', 'bedroom2');
        }
        if (hubStaircaseBtn) hubStaircaseBtn.style.display = 'inline-flex';
        if (navStairsBtn) navStairsBtn.style.display = 'inline-flex';
        if (hubMezzanineBtn) hubMezzanineBtn.style.display = 'inline-flex';
        if (navMezzanineBtn) navMezzanineBtn.style.display = 'inline-flex';
        if (hubSkyLoungeBtn) hubSkyLoungeBtn.style.display = 'inline-flex';
        if (navSkyLoungeBtn) navSkyLoungeBtn.style.display = 'inline-flex';
        if (hubTerraceBtn) hubTerraceBtn.style.display = 'inline-flex';
        if (hubBathBtn) hubBathBtn.style.display = 'inline-flex';
        if (navBathBtn) navBathBtn.style.display = 'inline-flex';
        if (hubMasterBathBtn) {
          hubMasterBathBtn.style.display = 'inline-flex';
          hubMasterBathBtn.innerHTML = '🛁 Spa Bath (L2)';
        }
        if (navMasterBathBtn) {
          navMasterBathBtn.style.display = 'inline-flex';
          navMasterBathBtn.innerHTML = '<span>🛁</span> Spa Bath';
        }
        if (navYardBtn) navYardBtn.style.display = 'none';
      } else if (is3BHK) {
        if (hubFoyerBtn) hubFoyerBtn.style.display = 'inline-flex';
        if (navFoyerBtn) navFoyerBtn.style.display = 'inline-flex';
        if (hubRearBtn) {
          hubRearBtn.style.display = 'inline-flex';
          hubRearBtn.innerHTML = '🛏️ Bed 2';
          hubRearBtn.setAttribute('data-zone', 'bedroom2');
        }
        if (navRearBtn) {
          navRearBtn.style.display = 'inline-flex';
          navRearBtn.innerHTML = '<span>🛏️</span> Bed 2';
          navRearBtn.setAttribute('data-target-room', 'bedroom2');
        }
        if (hubBed3Btn) hubBed3Btn.style.display = 'inline-flex';
        if (navBed3Btn) navBed3Btn.style.display = 'inline-flex';
        if (hubBalconyBtn) hubBalconyBtn.style.display = 'inline-flex';
        if (navBalconyBtn) navBalconyBtn.style.display = 'inline-flex';
        if (hubBathBtn) hubBathBtn.style.display = 'inline-flex';
        if (navBathBtn) navBathBtn.style.display = 'inline-flex';
        if (hubMasterBathBtn) {
          hubMasterBathBtn.style.display = 'inline-flex';
          hubMasterBathBtn.innerHTML = '🛁 Master Bath';
        }
        if (navMasterBathBtn) {
          navMasterBathBtn.style.display = 'inline-flex';
          navMasterBathBtn.innerHTML = '<span>🛁</span> Master Bath';
        }
        if (navYardBtn) navYardBtn.style.display = 'none';
      } else if (is2BHK) {
        if (hubFoyerBtn) hubFoyerBtn.style.display = 'inline-flex';
        if (navFoyerBtn) navFoyerBtn.style.display = 'inline-flex';
        if (hubRearBtn) {
          hubRearBtn.style.display = 'inline-flex';
          hubRearBtn.innerHTML = '🛏️ Bed 2';
          hubRearBtn.setAttribute('data-zone', 'bedroom2');
        }
        if (navRearBtn) {
          navRearBtn.style.display = 'inline-flex';
          navRearBtn.innerHTML = '<span>🛏️</span> Bed 2';
          navRearBtn.setAttribute('data-target-room', 'bedroom2');
        }
        if (hubBathBtn) hubBathBtn.style.display = 'inline-flex';
        if (navBathBtn) navBathBtn.style.display = 'inline-flex';
        if (hubMasterBathBtn) {
          hubMasterBathBtn.style.display = 'inline-flex';
          hubMasterBathBtn.innerHTML = '🛁 Master Bath';
        }
        if (navMasterBathBtn) {
          navMasterBathBtn.style.display = 'inline-flex';
          navMasterBathBtn.innerHTML = '<span>🛁</span> Master Bath';
        }
        if (navYardBtn) navYardBtn.style.display = 'inline-flex';
      } else {
        // 1 BHK
        if (hubFoyerBtn) hubFoyerBtn.style.display = 'inline-flex';
        if (navFoyerBtn) navFoyerBtn.style.display = 'inline-flex';
        if (hubRearBtn) hubRearBtn.style.display = 'none';
        if (navRearBtn) navRearBtn.style.display = 'none';
        if (hubBathBtn) hubBathBtn.style.display = 'none';
        if (navBathBtn) navBathBtn.style.display = 'none';
        if (hubMasterBathBtn) {
          hubMasterBathBtn.style.display = 'inline-flex';
          hubMasterBathBtn.innerHTML = '🛁 Master Bath';
        }
        if (navMasterBathBtn) {
          navMasterBathBtn.style.display = 'inline-flex';
          navMasterBathBtn.innerHTML = '<span>🛁</span> Master Bath';
        }
        if (navYardBtn) navYardBtn.style.display = 'none';
      }
    }
  }

  // Backward compatibility alias
  syncBedroomVariantsUI(currentRoomType) {
    this.syncRoomVariantsUI(currentRoomType);
  }

  // Complete House Room Navigator Focus & Camera Transition
  focusRoom(zoneKey, animate = true) {
    this.currentHouseZone = zoneKey;

    // Update buttons in #house-navigator-bar
    document.querySelectorAll('.house-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.targetRoom === zoneKey);
    });

    // Update buttons in #house-hub-wrapper
    document.querySelectorAll('.house-zone-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.zone === zoneKey);
    });

    const pill = document.getElementById('house-active-room-pill');
    const isDuplex = (this.currentHouseType === 'duplex') || (document.getElementById('room-type')?.value === 'duplex');
    const is3BHK = (this.currentHouseType === '3bhk') || (document.getElementById('room-type')?.value === 'complete_house_3bhk');
    const is2BHK = (this.currentHouseType === '2bhk') || (document.getElementById('room-type')?.value === 'complete_house_2bhk');
    const titles = {
      all: isDuplex ? 'Modern Duplex Villa' : (is3BHK ? 'Luxury 3 BHK Residence' : (is2BHK ? 'Architectural 2 BHK Residence' : 'Single Bedroom House (1 BHK)')),
      living: isDuplex ? 'Double-Height Living Lounge' : 'Living Room Lounge',
      dining: 'Dining Area',
      kitchen: isDuplex ? 'Gourmet Island Kitchen' : 'Modular Kitchen',
      bedroom: isDuplex ? 'Guest Bedroom Suite' : (is3BHK || is2BHK ? 'Master Bedroom Suite' : 'Master Bedroom'),
      bedroom2: isDuplex ? 'Penthouse Master Suite (L2)' : 'Second Bedroom',
      bedroom3: 'Third Bedroom / Study',
      foyer: isDuplex ? 'Grand Entrance Foyer' : 'Entrance Foyer',
      common_bath: isDuplex ? 'Guest Bathroom' : 'Common Bathroom',
      master_bath: isDuplex ? 'Master Spa Bathroom (L2)' : 'Master En-Suite Bathroom',
      staircase: 'Floating Cantilevered Staircase',
      mezzanine: 'Mezzanine Gallery (L2)',
      sky_lounge: 'Upper Loft Sky Lounge (L2)',
      balcony: 'Front Balcony Deck',
      terrace: 'Sunken Terrace & Pool Deck',
      backyard: 'Backyard Garden & Patio'
    };
    if (pill) pill.textContent = (titles[zoneKey] || 'Room') + ' Active';

    // Show corresponding room variant selector in sidebar
    this.syncRoomVariantsUI(document.getElementById('room-type')?.value || 'complete_house');

    // Camera target positions
    let targetPos, targetLook;
    if (isDuplex) {
      switch (zoneKey) {
        case 'foyer':
          targetPos = new THREE.Vector3(-4.6, 3.8, 8.8);
          targetLook = new THREE.Vector3(-4.6, 1.2, 4.8);
          this.showToast('🚪 Viewing Grand Entrance Foyer');
          break;
        case 'living':
          targetPos = new THREE.Vector3(-0.5, 5.0, 9.2);
          targetLook = new THREE.Vector3(-0.5, 2.0, 3.7);
          this.showToast('🛋️ Viewing Double-Height Grand Living Lounge');
          break;
        case 'dining':
          targetPos = new THREE.Vector3(4.35, 4.5, 8.5);
          targetLook = new THREE.Vector3(4.35, 1.2, 4.1);
          this.showToast('🍽️ Viewing Formal Dining Area');
          break;
        case 'kitchen':
          targetPos = new THREE.Vector3(4.35, 4.5, 3.5);
          targetLook = new THREE.Vector3(4.35, 1.2, -0.5);
          this.showToast('🍳 Viewing Gourmet Modular Kitchen');
          break;
        case 'bedroom':
          targetPos = new THREE.Vector3(-4.15, 4.5, 1.2);
          targetLook = new THREE.Vector3(-4.15, 1.2, -3.5);
          this.showToast('🛏️ Viewing Ground Guest Suite');
          break;
        case 'common_bath':
          targetPos = new THREE.Vector3(-0.5, 4.0, 0.5);
          targetLook = new THREE.Vector3(-0.5, 1.2, -3.0);
          this.showToast('🚿 Viewing Ground Guest Bathroom');
          break;
        case 'staircase':
          targetPos = new THREE.Vector3(-1.8, 4.2, 7.2);
          targetLook = new THREE.Vector3(1.0, 2.0, 3.5);
          this.showToast('🪜 Viewing Architectural Floating Staircase');
          break;
        case 'mezzanine':
          targetPos = new THREE.Vector3(0.0, 6.0, 6.8);
          targetLook = new THREE.Vector3(1.4, 3.8, 3.2);
          this.showToast('✨ Viewing Mezzanine Gallery & Walkway (Level 2)');
          break;
        case 'bedroom2':
          targetPos = new THREE.Vector3(4.35, 6.2, 4.8);
          targetLook = new THREE.Vector3(4.35, 3.8, 0.0);
          this.showToast('👑 Viewing Penthouse Master Suite (Level 2)');
          break;
        case 'master_bath':
          targetPos = new THREE.Vector3(4.35, 6.0, -1.0);
          targetLook = new THREE.Vector3(4.35, 3.8, -4.5);
          this.showToast('🛁 Viewing Master Spa Bathroom (Level 2)');
          break;
        case 'sky_lounge':
          targetPos = new THREE.Vector3(-3.5, 6.2, 1.5);
          targetLook = new THREE.Vector3(-3.5, 3.8, -2.75);
          this.showToast('🌆 Viewing Upper Loft Sky Lounge & Study (Level 2)');
          break;
        case 'terrace':
          targetPos = new THREE.Vector3(4.35, 4.5, 10.5);
          targetLook = new THREE.Vector3(4.35, 1.0, 7.4);
          this.showToast('🌿 Viewing Outdoor Sunken Terrace & Pool Deck');
          break;
        case 'all':
        default:
          targetPos = new THREE.Vector3(0, 19.0, 20.0);
          targetLook = new THREE.Vector3(0, 1.4, 0.5);
          this.showToast('🏙️ Viewing Modern Duplex Villa (Double-Height Architecture)');
          break;
      }
    } else if (is3BHK) {
      switch (zoneKey) {
        case 'foyer':
          targetPos = new THREE.Vector3(-5.0, 3.8, 8.8);
          targetLook = new THREE.Vector3(-5.0, 1.2, 4.95);
          this.showToast('🚪 Viewing Entrance Foyer');
          break;
        case 'living':
          targetPos = new THREE.Vector3(-0.5, 4.2, 8.5);
          targetLook = new THREE.Vector3(-0.5, 1.2, 4.15);
          this.showToast('🛋️ Viewing Living Room Lounge');
          break;
        case 'dining':
          targetPos = new THREE.Vector3(5.0, 4.2, 8.5);
          targetLook = new THREE.Vector3(5.0, 1.2, 4.15);
          this.showToast('🍽️ Viewing Dining Pavilion');
          break;
        case 'kitchen':
          targetPos = new THREE.Vector3(5.0, 4.2, 3.5);
          targetLook = new THREE.Vector3(5.0, 1.2, -0.35);
          this.showToast('🍳 Viewing Modular Kitchen & Island');
          break;
        case 'bedroom':
          targetPos = new THREE.Vector3(5.0, 4.2, -1.0);
          targetLook = new THREE.Vector3(5.0, 1.2, -5.25);
          this.showToast('👑 Viewing Master Bedroom Suite (Bed 1)');
          break;
        case 'master_bath':
          targetPos = new THREE.Vector3(6.3, 3.8, 2.5);
          targetLook = new THREE.Vector3(6.3, 1.2, -1.15);
          this.showToast('🛁 Viewing Master En-Suite Bathroom');
          break;
        case 'bedroom2':
          targetPos = new THREE.Vector3(-5.0, 4.2, -1.0);
          targetLook = new THREE.Vector3(-5.0, 1.2, -5.25);
          this.showToast('🛏️ Viewing Second Bedroom (Bed 2)');
          break;
        case 'bedroom3':
          targetPos = new THREE.Vector3(-5.5, 4.2, 3.5);
          targetLook = new THREE.Vector3(-5.5, 1.2, -0.35);
          this.showToast('🧸 Viewing Third Bedroom / Executive Study (Bed 3)');
          break;
        case 'common_bath':
          targetPos = new THREE.Vector3(-2.25, 3.8, 2.5);
          targetLook = new THREE.Vector3(-2.25, 1.2, -1.15);
          this.showToast('🚿 Viewing Common Bathroom');
          break;
        case 'balcony':
          targetPos = new THREE.Vector3(-0.5, 3.5, 10.5);
          targetLook = new THREE.Vector3(-0.5, 1.0, 7.45);
          this.showToast('🌅 Viewing Private Balcony Deck');
          break;
        case 'all':
        default:
          targetPos = new THREE.Vector3(0, 18.0, 21.0);
          targetLook = new THREE.Vector3(0, 0.8, 0.5);
          this.showToast('🏰 Viewing Luxury 3 BHK Residence (All 10 Connected Spaces)');
          break;
      }
    } else if (is2BHK) {
      switch (zoneKey) {
        case 'living':
          targetPos = new THREE.Vector3(-0.4, 4.2, 8.5);
          targetLook = new THREE.Vector3(-0.4, 1.2, 4.1);
          this.showToast('🛋️ Viewing Living Room Lounge');
          break;
        case 'dining':
          targetPos = new THREE.Vector3(0.3, 4.2, 5.0);
          targetLook = new THREE.Vector3(0.3, 1.1, 0.1);
          this.showToast('🍽️ Viewing Dining Area');
          break;
        case 'kitchen':
          targetPos = new THREE.Vector3(0.3, 4.2, 1.0);
          targetLook = new THREE.Vector3(0.3, 1.1, -3.8);
          this.showToast('🍳 Viewing Modular Kitchen');
          break;
        case 'bedroom':
          targetPos = new THREE.Vector3(4.4, 4.2, 8.2);
          targetLook = new THREE.Vector3(4.4, 1.2, 3.7);
          this.showToast('👑 Viewing Master Bedroom Suite');
          break;
        case 'bedroom2':
          targetPos = new THREE.Vector3(-4.0, 4.2, 2.5);
          targetLook = new THREE.Vector3(-4.0, 1.2, -2.7);
          this.showToast('🛏️ Viewing Second Bedroom');
          break;
        case 'foyer':
          targetPos = new THREE.Vector3(-4.7, 3.8, 8.8);
          targetLook = new THREE.Vector3(-4.7, 1.2, 4.9);
          this.showToast('🚪 Viewing Entrance Foyer');
          break;
        case 'common_bath':
          targetPos = new THREE.Vector3(-4.7, 3.8, 5.8);
          targetLook = new THREE.Vector3(-4.7, 1.2, 2.0);
          this.showToast('🚿 Viewing Common Bathroom');
          break;
        case 'master_bath':
          targetPos = new THREE.Vector3(5.4, 3.8, 3.0);
          targetLook = new THREE.Vector3(5.4, 1.2, -0.5);
          this.showToast('🛁 Viewing Master En-Suite Bathroom');
          break;
        case 'walk_in_closet':
          targetPos = new THREE.Vector3(3.4, 3.8, 3.0);
          targetLook = new THREE.Vector3(3.4, 1.2, -0.5);
          this.showToast('👗 Viewing Walk-In Wardrobe');
          break;
        case 'backyard':
          targetPos = new THREE.Vector3(4.4, 6.5, -3.5);
          targetLook = new THREE.Vector3(4.4, 1.0, -7.5);
          this.showToast('🌿 Viewing Backyard Garden & Patio');
          break;
        case 'all':
        default:
          targetPos = new THREE.Vector3(0, 16.5, 19.5);
          targetLook = new THREE.Vector3(0, 0.8, 0.5);
          this.showToast('🏛️ Viewing Architectural 2 BHK Residence (All Rooms)');
          break;
      }
    } else {
      // 1 BHK (Single Bedroom House - 6 Rooms: Foyer, Living, Dining, Kitchen, Master Bedroom, Master Bathroom)
      switch (zoneKey) {
        case 'foyer':
          targetPos = new THREE.Vector3(-4.7, 3.8, 8.8);
          targetLook = new THREE.Vector3(-4.7, 1.2, 4.6);
          this.showToast('🚪 Viewing Entrance Foyer');
          break;
        case 'living':
          targetPos = new THREE.Vector3(-0.1, 4.2, 8.5);
          targetLook = new THREE.Vector3(-0.1, 1.2, 4.1);
          this.showToast('🛋️ Viewing Living Room Lounge');
          break;
        case 'dining':
          targetPos = new THREE.Vector3(4.9, 4.2, 8.5);
          targetLook = new THREE.Vector3(4.9, 1.2, 4.1);
          this.showToast('🍽️ Viewing Dining Area');
          break;
        case 'kitchen':
          targetPos = new THREE.Vector3(4.9, 4.2, 2.0);
          targetLook = new THREE.Vector3(4.9, 1.2, -2.2);
          this.showToast('🍳 Viewing Modular Kitchen');
          break;
        case 'bedroom':
          targetPos = new THREE.Vector3(-3.5, 4.2, 2.5);
          targetLook = new THREE.Vector3(-3.5, 1.2, -2.0);
          this.showToast('👑 Viewing Master Bedroom Suite');
          break;
        case 'master_bath':
          targetPos = new THREE.Vector3(1.1, 3.8, 0.5);
          targetLook = new THREE.Vector3(1.1, 1.2, -3.6);
          this.showToast('🛁 Viewing Master En-Suite Bathroom');
          break;
        case 'all':
        default:
          targetPos = new THREE.Vector3(0, 16.5, 18.5);
          targetLook = new THREE.Vector3(0, 0.8, 0.5);
          this.showToast('🏠 Viewing Single Bedroom House (All 6 Connected Rooms)');
          break;
      }
    }

    if (animate) {
      this.cameraAnimation = {
        targetPos: targetPos,
        targetLook: targetLook
      };
    } else {
      this.cameraAnimation = null;
      this.camera.position.copy(targetPos);
      this.controls.target.copy(targetLook);
      this.controls.update();
    }
  }

  // 6. CAMERA PRESETS & WALKTHROUGH
  setCameraPreset(mode) {
    if (mode === 'flow') {
      this.startRealTimeRoomFlowTour();
      return;
    }

    if (this.isTouring) {
      this.stopRealTimeRoomFlowTour();
    }

    const hud = document.getElementById('walkthrough-hud');
    if (mode === 'walk') {
      this.isWalkthrough = true;
      if (hud) hud.style.display = 'block';
      if (this.roomBuilder.isCompleteHouse) {
        this.camera.position.set(-4.0, 1.6, 4.5);
        this.controls.target.set(-4.0, 1.55, 2.0);
      } else {
        this.camera.position.set(0, 1.6, 1.6);
        this.controls.target.set(0, 1.55, -0.6);
      }
      this.controls.maxPolarAngle = Math.PI - 0.05;
      this.controls.minDistance = 0.05;
      this.showToast('Walkthrough active! Use WASD or Arrow Keys to walk through the house');
    } else {
      this.isWalkthrough = false;
      if (hud) hud.style.display = 'none';
      this.controls.maxPolarAngle = Math.PI / 2 - 0.02;
      this.controls.minDistance = 2.0;
      this.cameraAnimation = null;

      if (this.roomBuilder.isCompleteHouse) {
        this.controls.maxDistance = 45.0;
        switch (mode) {
          case 'top':
            this.camera.position.set(0, 22.0, 0.001);
            this.controls.target.set(0, 0, 0.25);
            this.showToast('🗺️ Viewing Top-Down 3D Floor Plan');
            break;
          case 'front':
            this.camera.position.set(0, 3.5, 17.5);
            this.controls.target.set(0, 1.4, 0.5);
            this.showToast('🏛️ Viewing Front Perspective House View');
            break;
          case 'living':
            this.focusRoom('living', false);
            return;
          case 'bedroom':
            this.focusRoom('bedroom', false);
            return;
          case 'kitchen':
            this.focusRoom('kitchen', false);
            return;
          case 'dining':
            this.focusRoom('dining', false);
            return;
          case 'bathroom':
            this.focusRoom('common_bath', false);
            return;
          case '3d':
          default:
            this.camera.position.set(0, 14.5, 17.5);
            this.controls.target.set(0, 1.0, 0.5);
            this.showToast('📐 Viewing Free 3D House Overview');
            break;
        }
      } else {
        this.controls.maxDistance = 20.0;
        switch (mode) {
          case 'top':
            this.camera.position.set(0, 9.0, 0.001);
            this.controls.target.set(0, 0, 0);
            break;
          case 'front':
            this.camera.position.set(0, 1.8, 6.5);
            this.controls.target.set(0, 1.4, 0);
            break;
          case '3d':
          default:
            this.camera.position.set(0, 4.5, 6.8);
            this.controls.target.set(0, 1.0, 0);
            break;
        }
      }
    }
    this.controls.update();
  }

  // REAL-TIME ROOM FLOW ANIMATED WALKTHROUGH TOUR
  startRealTimeRoomFlowTour() {
    this.isTouring = true;
    this.isWalkthrough = true;
    const isDuplex = (this.currentHouseType === 'duplex') || (document.getElementById('room-type')?.value === 'duplex');
    const is3BHK = (this.currentHouseType === '3bhk') || (document.getElementById('room-type')?.value === 'complete_house_3bhk');
    const is2BHK = (this.currentHouseType === '2bhk') || (document.getElementById('room-type')?.value === 'complete_house_2bhk');
    const hud = document.getElementById('walkthrough-hud');
    if (hud) {
      hud.style.display = 'block';
      const pill = hud.querySelector('.hud-pill span');
      if (pill) {
        if (isDuplex) {
          pill.innerHTML = '🌊 <strong>Room Flow Tour Active</strong>: Foyer → Double-Height Living → Dining → Kitchen → Guest Suite → Floating Stairs → Mezzanine → Penthouse Master → Spa Bath → Sky Lounge';
        } else if (is3BHK) {
          pill.innerHTML = '🌊 <strong>Room Flow Tour Active</strong>: Foyer → Living → Balcony → Dining → Kitchen → Master Suite & Bath → Bed 2 → Bed 3 → Common Bath';
        } else if (is2BHK) {
          pill.innerHTML = '🌊 <strong>Room Flow Tour Active</strong>: Foyer → Living → Dining → Kitchen → Master Suite & Bath → Bed 2 & Common Bath';
        } else {
          pill.innerHTML = '🌊 <strong>Room Flow Tour Active</strong>: Foyer → Living → Dining → Modular Kitchen → Master Suite → En-Suite Bath';
        }
      }
    }
    this.showToast(isDuplex
      ? '🌊 Real-time tour started: Foyer → Living → Kitchen → Floating Stairs → Penthouse Master'
      : (is3BHK
        ? '🌊 Real-time tour started: Foyer → Living → Balcony → Dining → Master Suite → Bed 2 & 3'
        : (is2BHK
          ? '🌊 Real-time architectural tour started: Foyer → Living → Dining → Kitchen → Master Suite → Bed 2'
          : '🌊 Real-time tour started: Foyer → Living → Dining → Kitchen → Master Suite → Master Bath')));

    const waypoints = isDuplex ? [
      { pos: new THREE.Vector3(-4.6, 1.55, 5.8), target: new THREE.Vector3(-4.6, 1.35, 3.5), duration: 4000, desc: '🚪 Grand Entrance Foyer with Fluted Marble Console' },
      { pos: new THREE.Vector3(-0.5, 1.8, 5.2), target: new THREE.Vector3(-3.0, 2.0, 3.7), duration: 4500, desc: '🛋️ Double-Height 5.6m Grand Living Lounge with 4K Entertainment' },
      { pos: new THREE.Vector3(4.35, 1.55, 5.2), target: new THREE.Vector3(4.35, 1.35, 3.5), duration: 4000, desc: '🍽️ Formal Dining Area with Solid Walnut Table & Chandelier' },
      { pos: new THREE.Vector3(4.35, 1.55, 1.5), target: new THREE.Vector3(4.35, 1.35, -1.5), duration: 4500, desc: '🍳 Gourmet Modular Kitchen with Waterfall Prep Island & Stools' },
      { pos: new THREE.Vector3(-4.15, 1.55, -1.5), target: new THREE.Vector3(-4.15, 1.35, -5.5), duration: 4500, desc: '🛏️ Ground Guest Bedroom Suite with Wardrobe & Garden View' },
      { pos: new THREE.Vector3(1.0, 1.6, 5.2), target: new THREE.Vector3(1.0, 3.2, 2.0), duration: 4000, desc: '🪜 Floating Cantilevered Staircase with Glass Railing & Under-Step Glow' },
      { pos: new THREE.Vector3(1.4, 4.3, 3.8), target: new THREE.Vector3(-0.5, 2.0, 3.7), duration: 4500, desc: '✨ Elevated Mezzanine Gallery Walkway Overlooking Living Void' },
      { pos: new THREE.Vector3(4.35, 4.35, 2.0), target: new THREE.Vector3(4.35, 4.15, -1.8), duration: 5000, desc: '👑 Penthouse Master Suite (Level 2) with King Bed & Glass Wardrobe' },
      { pos: new THREE.Vector3(4.35, 4.35, -2.5), target: new THREE.Vector3(4.35, 4.15, -4.5), duration: 4000, desc: '🛁 Master Spa Bathroom (Level 2) with Double Shower & Dual Vanity' },
      { pos: new THREE.Vector3(-3.5, 4.35, -0.5), target: new THREE.Vector3(-3.5, 4.15, -3.5), duration: 4500, desc: '🌆 Upper Loft Sky Lounge & Executive Mezzanine Study (Level 2)' }
    ] : (is3BHK ? [
      { pos: new THREE.Vector3(-5.0, 1.55, 5.8), target: new THREE.Vector3(-5.0, 1.35, 3.8), duration: 4000, desc: '🚪 Entrance Foyer with Slatted Teak Screen & Console' },
      { pos: new THREE.Vector3(-0.5, 1.55, 5.0), target: new THREE.Vector3(-3.25, 1.35, 4.15), duration: 4500, desc: '🛋️ Open Living Lounge with Missouri TV Unit Facing Sectional Sofa' },
      { pos: new THREE.Vector3(-0.5, 1.45, 7.2), target: new THREE.Vector3(-0.5, 1.25, 8.0), duration: 4000, desc: '🌅 Front Balcony Deck with Outdoor Teak Lounge Armchairs & Planters' },
      { pos: new THREE.Vector3(5.0, 1.55, 5.0), target: new THREE.Vector3(5.0, 1.35, 3.8), duration: 4000, desc: '🍽️ Dining Pavilion with Solid Hardwood Table & Chandelier' },
      { pos: new THREE.Vector3(5.0, 1.55, 1.5), target: new THREE.Vector3(5.0, 1.35, -1.5), duration: 4500, desc: '🍳 Modular Kitchen with Prep Island, Breakfast Stools & Double Sink' },
      { pos: new THREE.Vector3(5.0, 1.55, -3.2), target: new THREE.Vector3(5.0, 1.35, -6.8), duration: 5000, desc: '👑 Master Bedroom Suite (Bed 1) with King Bed, Wardrobe & Vanity' },
      { pos: new THREE.Vector3(6.3, 1.55, -0.2), target: new THREE.Vector3(6.3, 1.35, -1.5), duration: 4000, desc: '🛁 Master En-Suite Bathroom with Glass Rain Shower & Floating Vanity' },
      { pos: new THREE.Vector3(-5.0, 1.55, -3.2), target: new THREE.Vector3(-5.0, 1.35, -6.8), duration: 4500, desc: '🛏️ Quiet Second Bedroom Suite (Bed 2) with Queen Bed & Study Desk' },
      { pos: new THREE.Vector3(-5.5, 1.55, 1.2), target: new THREE.Vector3(-5.5, 1.35, -1.2), duration: 4500, desc: '🧸 Third Bedroom / Executive Study (Bed 3) with Workstation & Bookshelf' },
      { pos: new THREE.Vector3(-2.25, 1.55, 0.2), target: new THREE.Vector3(-2.25, 1.35, -1.5), duration: 4000, desc: '🚿 Designer Common Family Bathroom with Shower & Vanity' }
    ] : (is2BHK ? [
      { pos: new THREE.Vector3(-4.7, 1.55, 5.6), target: new THREE.Vector3(-4.7, 1.35, 3.6), duration: 4000, desc: '🚪 Grand Entrance Foyer with Pivot Door & Slat Divider' },
      { pos: new THREE.Vector3(-0.4, 1.55, 4.6), target: new THREE.Vector3(-2.95, 1.35, 4.1), duration: 4500, desc: '🛋️ Open Living Lounge with Missouri TV Unit Facing Sectional Sofa' },
      { pos: new THREE.Vector3(0.3, 1.55, 1.4), target: new THREE.Vector3(0.3, 1.35, 0.1), duration: 4000, desc: '🍽️ Seamless transition to Central Dining Pavilion with Crockery Credenza' },
      { pos: new THREE.Vector3(0.3, 1.55, -2.0), target: new THREE.Vector3(0.3, 1.35, -5.6), duration: 4500, desc: '🍳 High-Efficiency Modular Kitchen, Waterfall Island & Range Hood' },
      { pos: new THREE.Vector3(3.4, 1.55, 3.7), target: new THREE.Vector3(5.3, 1.35, 3.7), duration: 4500, desc: '👑 Master Bedroom Suite with King Bed on East Wall & Dressing Vanity' },
      { pos: new THREE.Vector3(3.4, 1.55, -0.2), target: new THREE.Vector3(2.75, 1.35, -0.5), duration: 4000, desc: '👗 Walk-In Dressing Room with Sliding Mirrored Wardrobes' },
      { pos: new THREE.Vector3(4.9, 1.55, -0.2), target: new THREE.Vector3(5.7, 1.35, -1.3), duration: 4000, desc: '🛁 Master En-Suite Designer Bathroom with Glass Rain Shower' },
      { pos: new THREE.Vector3(-3.2, 1.55, -1.2), target: new THREE.Vector3(-5.1, 1.35, -2.7), duration: 4500, desc: '🛏️ Quiet Second Bedroom Suite with Terracotta Accent Wall & Study Desk' },
      { pos: new THREE.Vector3(-3.8, 1.55, 2.1), target: new THREE.Vector3(-5.5, 1.35, 1.4), duration: 4000, desc: '🚿 Designer Common Bathroom with Walk-In Shower & Floating Vanity' }
    ] : [
      { pos: new THREE.Vector3(-4.7, 1.55, 5.6), target: new THREE.Vector3(-4.7, 1.35, 3.8), duration: 4000, desc: '🚪 Entrance Foyer with Adjustable Door, Slat Screen & Console' },
      { pos: new THREE.Vector3(-0.1, 1.55, 4.6), target: new THREE.Vector3(-0.1, 1.35, 1.8), duration: 4500, desc: '🛋️ Open Living Lounge with Missouri 4K TV & Plush Sofa' },
      { pos: new THREE.Vector3(4.9, 1.55, 4.6), target: new THREE.Vector3(4.9, 1.35, 3.2), duration: 4000, desc: '🍽️ Formal Dining Area with Solid Hardwood Table & Chandelier' },
      { pos: new THREE.Vector3(4.9, 1.55, 0.5), target: new THREE.Vector3(4.9, 1.35, -3.2), duration: 4500, desc: '🍳 Modular Kitchen with Prep Island, Range Hood & French Refrigerator' },
      { pos: new THREE.Vector3(-3.5, 1.55, 0.5), target: new THREE.Vector3(-3.5, 1.35, -3.5), duration: 5000, desc: '👑 Master Bedroom Suite with King Bed, Dressing Vanity & Split AC' },
      { pos: new THREE.Vector3(1.1, 1.55, -2.0), target: new THREE.Vector3(1.1, 1.35, -4.5), duration: 4000, desc: '🛁 Master En-Suite Bathroom with Frameless Shower & Lighted Mirror' }
    ]));

    let currentWaypointIdx = 0;
    let startTime = performance.now();
    let startPos = this.camera.position.clone();
    let startTarget = this.controls.target.clone();

    if (this.tourAnimId) cancelAnimationFrame(this.tourAnimId);

    const step = (now) => {
      if (!this.isTouring) return;

      const wp = waypoints[currentWaypointIdx];
      const elapsed = now - startTime;
      const progress = Math.min(1.0, elapsed / wp.duration);
      const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      this.camera.position.lerpVectors(startPos, wp.pos, ease);
      this.controls.target.lerpVectors(startTarget, wp.target, ease);
      this.camera.lookAt(this.controls.target);

      if (progress >= 1.0) {
        currentWaypointIdx = (currentWaypointIdx + 1) % waypoints.length;
        startTime = performance.now();
        startPos = this.camera.position.clone();
        startTarget = this.controls.target.clone();
        this.showToast(waypoints[currentWaypointIdx].desc);
      }

      this.tourAnimId = requestAnimationFrame(step);
    };

    this.tourAnimId = requestAnimationFrame(step);
  }

  stopRealTimeRoomFlowTour() {
    this.isTouring = false;
    if (this.tourAnimId) cancelAnimationFrame(this.tourAnimId);
    const hud = document.getElementById('walkthrough-hud');
    if (hud) hud.style.display = 'none';
  }

  // 7. AI DESIGN GENERATION
  async triggerAIGeneration() {
    this.showToast('AI is optimizing spatial layout...');

    const currentRoomType = document.getElementById('room-type')?.value || 'complete_house';
    const isDuplex = (currentRoomType === 'duplex' || currentRoomType === 'duplex_villa' || this.currentHouseType === 'duplex');
    const is3BHK = (currentRoomType === 'complete_house_3bhk' || currentRoomType === '3bhk' || this.currentHouseType === '3bhk');
    const is2BHK = (currentRoomType === 'complete_house_2bhk' || this.currentHouseType === '2bhk');
    const isHouse = (currentRoomType === 'complete_house' || is2BHK || is3BHK || isDuplex);
    if (isHouse) {
      this.currentHouseType = isDuplex ? 'duplex' : (is3BHK ? '3bhk' : (is2BHK ? '2bhk' : '1bhk'));
    }

    let bedType = isHouse ? (this.currentHouseRoomTypes.bedroom || 1) : 1;
    if (currentRoomType === 'bedroom_zen') bedType = 2;
    else if (currentRoomType === 'bedroom_hotel') bedType = 3;
    else if (currentRoomType === 'bedroom_scandi') bedType = 4;

    let livingType = isHouse ? (this.currentHouseRoomTypes.living || 1) : 1;
    if (currentRoomType === 'living_room_zen') livingType = 2;
    else if (currentRoomType === 'living_room_luxury') livingType = 3;
    else if (currentRoomType === 'living_room_cozy') livingType = 4;

    let diningType = isHouse ? (this.currentHouseRoomTypes.dining || 1) : 1;
    if (currentRoomType === 'dining_room_minimal') diningType = 2;
    else if (currentRoomType === 'dining_room_luxury') diningType = 3;
    else if (currentRoomType === 'dining_room_scandi') diningType = 4;

    let kitchenType = isHouse ? (this.currentHouseRoomTypes.kitchen || 1) : 1;
    if (currentRoomType === 'kitchen_lshape') kitchenType = 2;
    else if (currentRoomType === 'kitchen_galley') kitchenType = 3;
    else if (currentRoomType === 'kitchen_ushape') kitchenType = 4;

    this.syncRoomVariantsUI(currentRoomType);

    const duplexDims = { width: 16.0, length: 16.0, height: 5.6 };
    const threeBhkDims = { width: 19.0, length: 18.5, height: 2.8 };
    const villaDims = { width: 16.0, length: 18.5, height: 2.8 };
    const houseDims = isDuplex ? duplexDims : (is3BHK ? threeBhkDims : (is2BHK ? villaDims : { width: 14.0, length: 13.0, height: 2.8 }));
    const singleDims = {
      width: parseFloat(document.getElementById('room-w').value) || 5.0,
      length: parseFloat(document.getElementById('room-l').value) || 4.5,
      height: parseFloat(document.getElementById('room-h').value) || 2.8
    };

    const pref = {
      roomType: currentRoomType,
      houseType: this.currentHouseType || (is2BHK ? '2bhk' : '1bhk'),
      bedroomType: bedType,
      livingRoomType: livingType,
      diningType: diningType,
      kitchenType: kitchenType,
      dimensions: isHouse ? houseDims : singleDims,
      style: this.currentStyle,
      colorScheme: document.getElementById('color-scheme').value,
      flooring: document.getElementById('flooring-select').value,
      lighting: 'warm_ambient',
      customNotes: ''
    };

    // 1. Rebuild room architecture with new dimensions and style
    this.currentRoomDimensions = pref.dimensions;
    if (isHouse) {
      const rw = document.getElementById('room-w');
      const rl = document.getElementById('room-l');
      const rh = document.getElementById('room-h');
      if (rw) rw.value = is2BHK ? '16.0' : '14.0';
      if (rl) rl.value = is2BHK ? '18.5' : '13.0';
      if (rh) rh.value = '2.8';
      this.roomBuilder.buildCompleteHouse(0xfaf5ee, pref.flooring, this.currentHouseType);
    } else {
      this.roomBuilder.buildRoom(pref.dimensions, 0xfaf5ee, pref.flooring);
    }

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

    // 5. Initial Camera Setup for Complete House
    if (isHouse && !this.initialHouseLoaded) {
      this.initialHouseLoaded = true;
      this.setCameraPreset('3d');
    }

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
      case 'missouri_tv_unit':
        meshGroup = FurnitureFactory.createMissouriTVUnit(style, itemData.color, itemData.design || itemData.variant || 1);
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
      case 'single_bed':
        meshGroup = FurnitureFactory.createSingleBed(style, itemData.color);
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
        table.userData = { id: itemData.id || 'house_dining_set', type: 'dining_table', name: itemData.name || 'Dining Table', cost: 650, room: itemData.room };
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
      case 'straight_kitchen':
      case 'single_wall_kitchen':
        meshGroup = FurnitureFactory.createStraightModularKitchen(style, itemData.color);
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
      case 'washing_machine':
        meshGroup = FurnitureFactory.createWashingMachine(style, itemData.color);
        break;
      case 'microwave':
        meshGroup = FurnitureFactory.createMicrowave(style, itemData.color);
        break;
      case 'air_conditioner':
        meshGroup = FurnitureFactory.createAirConditioner(style);
        break;
      case 'ceiling_fan':
        meshGroup = FurnitureFactory.createCeilingFan(style, itemData.color);
        break;
      case 'coffee_machine':
        meshGroup = FurnitureFactory.createCoffeeMachine(style);
        break;
      case 'shoe_rack':
        meshGroup = FurnitureFactory.createShoeRack(style, itemData.color);
        break;
      case 'coat_rack':
        meshGroup = FurnitureFactory.createCoatRack(style);
        break;
      case 'trash_bin':
        meshGroup = FurnitureFactory.createTrashBin(style);
        break;
      case 'laundry_basket':
        meshGroup = FurnitureFactory.createLaundryBasket(style, itemData.color);
        break;
      case 'wall_clock':
        meshGroup = FurnitureFactory.createWallClock(style);
        break;
      case 'table_lamp':
        meshGroup = FurnitureFactory.createTableLamp(style, itemData.color);
        break;
      case 'ottoman':
        meshGroup = FurnitureFactory.createOttoman(style, itemData.color);
        break;
      case 'curtains':
        meshGroup = FurnitureFactory.createCurtains(style, itemData.color);
        break;
      case 'water_purifier':
        meshGroup = FurnitureFactory.createWaterPurifier(style);
        break;
      case 'toilet':
        meshGroup = FurnitureFactory.createToilet(style);
        break;
      case 'shower':
        meshGroup = FurnitureFactory.createShowerEnclosure(itemData.width || 1.1, itemData.depth || 1.0);
        break;
      case 'bathroom_vanity':
        meshGroup = FurnitureFactory.createBathroomVanity(itemData.width || 0.9, style);
        break;
      case 'bathroom_suite':
        meshGroup = FurnitureFactory.createBathroomSuite(itemData.suiteType || 'common');
        break;
      case 'foyer_console':
        meshGroup = FurnitureFactory.createFoyerConsole();
        break;
      case 'walk_in_wardrobe':
        meshGroup = FurnitureFactory.createWalkInWardrobe();
        break;
      case 'cognac_sectional':
        meshGroup = FurnitureFactory.createCognacLeatherSectional();
        break;
      case 'garden_bush':
        meshGroup = FurnitureFactory.createGardenBush(itemData.scale || 1.0, itemData.colorHex || 0x3f6212);
        break;
      case 'perimeter_hedge':
        meshGroup = FurnitureFactory.createPerimeterHedge(itemData.length || 2.0);
        break;
      case 'stepping_stones':
        meshGroup = FurnitureFactory.createSteppingStones(itemData.count || 4);
        break;
      case 'patio_set':
        meshGroup = FurnitureFactory.createPatioSet();
        break;
      case 'straight_kitchen':
        meshGroup = FurnitureFactory.createStraightModularKitchen(style, itemData.color);
        break;
      case 'courtyard_sectional':
        meshGroup = FurnitureFactory.createCourtyardSectional();
        break;
      case 'courtyard_fire_table':
        meshGroup = FurnitureFactory.createCourtyardFireTable();
        break;
      case 'courtyard_chair':
        meshGroup = FurnitureFactory.createCourtyardLoungeChair();
        break;
      case 'courtyard_pergola':
        meshGroup = FurnitureFactory.createPergolaStructure(itemData.width || 3.6, itemData.depth || 3.4, itemData.height || 2.75);
        break;
      case 'courtyard_greenwall':
        meshGroup = FurnitureFactory.createVerticalGreenWall(itemData.width || 2.4, itemData.height || 2.0);
        break;
      case 'courtyard_tree':
        meshGroup = FurnitureFactory.createCourtyardPlanterTree();
        break;
      case 'courtyard_fountain':
        meshGroup = FurnitureFactory.createBasaltWaterFeature();
        break;
      case 'courtyard_lanterns':
        meshGroup = FurnitureFactory.createOutdoorFloorLanterns();
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
    const roomType = document.getElementById('room-type')?.value || 'bedroom';
    const roomLabels = {
      duplex: 'Modern Duplex Villa (Double-Height & Mezzanine)',
      complete_house_3bhk: 'Luxury 3 BHK Residence',
      complete_house_2bhk: 'Architectural 2 BHK Residence',
      complete_house: 'Single Bedroom House (1 BHK)',
      bedroom: 'Master Bedroom Suite',
      bedroom_single: 'Single Bedroom (Compact Suite)',
      living_room: 'Living Room Lounge',
      dining_room: 'Dining Room Pavilion',
      kitchen: 'Modular Kitchen'
    };
    const roomTypeLabel = roomLabels[roomType] || roomType.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
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
    if (data.roomType) {
      document.getElementById('room-type').value = data.roomType;
      this.syncRoomVariantsUI(data.roomType);
    }
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

    // Smooth Camera Transition Lerp
    if (this.cameraAnimation) {
      this.camera.position.lerp(this.cameraAnimation.targetPos, 0.08);
      this.controls.target.lerp(this.cameraAnimation.targetLook, 0.08);
      if (this.camera.position.distanceTo(this.cameraAnimation.targetPos) < 0.05) {
        this.camera.position.copy(this.cameraAnimation.targetPos);
        this.controls.target.copy(this.cameraAnimation.targetLook);
        this.cameraAnimation = null;
      }
    }

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

  // ==========================================
  // 12. SOLAR STUDY & DYNAMIC DAYLIGHT SIMULATION
  // ==========================================
  initSunStudy() {
    const btnToggle = document.getElementById('btn-toggle-sun-study');
    const hud = document.getElementById('sun-study-hud');
    const btnClose = document.getElementById('btn-close-sun-study');
    const timeSlider = document.getElementById('sun-time-slider');
    const presetBtns = document.querySelectorAll('.sun-preset-btn');

    if (!hud) return;

    btnToggle?.addEventListener('click', () => {
      const isVisible = hud.style.display !== 'none';
      hud.style.display = isVisible ? 'none' : 'block';
      btnToggle.classList.toggle('active', !isVisible);
    });

    btnClose?.addEventListener('click', () => {
      hud.style.display = 'none';
      btnToggle?.classList.remove('active');
    });

    timeSlider?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      this.setTimeOfDay(val);
      presetBtns.forEach(b => b.classList.toggle('active', Math.abs(parseFloat(b.dataset.time) - val) < 0.6));
    });

    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const t = parseFloat(btn.dataset.time);
        if (timeSlider) timeSlider.value = t;
        presetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.setTimeOfDay(t);
      });
    });

    // Default to morning daylight (10:00 AM)
    this.setTimeOfDay(10.0);
  }

  setTimeOfDay(hour) {
    this.currentSunHour = hour;
    const timeDisplay = document.getElementById('sun-time-display');

    // Format display string (e.g. "10:30 AM — Morning Daylight")
    const hInt = Math.floor(hour);
    const mInt = Math.round((hour - hInt) * 60);
    const mStr = mInt < 10 ? `0${mInt}` : `${mInt}`;
    const period = hInt >= 12 ? 'PM' : 'AM';
    const displayH = hInt > 12 ? hInt - 12 : (hInt === 0 ? 12 : hInt);
    let phaseName = 'Daylight';

    // Solar orbit geometry:
    // Sun rises from East (-X), arcs across South (+Z), sets in West (+X)
    const normalized = Math.max(0, Math.min(1, (hour - 6) / 14)); // 0 at 6 AM, 1 at 8 PM
    const sunAngle = normalized * Math.PI;

    const sunDist = 24.0;
    const sunX = -Math.cos(sunAngle) * sunDist;
    const sunY = Math.max(0.8, Math.sin(sunAngle) * 22.0);
    const sunZ = 12.0 * Math.sin(sunAngle) + 6.0 * Math.cos(sunAngle);

    if (this.sunLight) {
      this.sunLight.position.set(sunX, sunY, sunZ);
    }

    if (hour < 7.5) {
      // Dawn / Early Sunrise (6:00 - 7:30)
      phaseName = 'Dawn Warm Sunrise';
      if (this.sunLight) {
        this.sunLight.color.setHex(0xff9944);
        this.sunLight.intensity = 0.85;
      }
      if (this.ambientLight) {
        this.ambientLight.color.setHex(0xd4bca8);
        this.ambientLight.intensity = 0.50;
      }
      if (this.ceilingLight) {
        this.ceilingLight.color.setHex(0xffe8c6);
        this.ceilingLight.intensity = 0.6;
      }
      this.scene.background = new THREE.Color(0x181728);
    } else if (hour < 11.5) {
      // Morning Daylight (7:30 - 11:30)
      phaseName = 'Morning Natural Daylight';
      if (this.sunLight) {
        this.sunLight.color.setHex(0xfffaec);
        this.sunLight.intensity = 1.25;
      }
      if (this.ambientLight) {
        this.ambientLight.color.setHex(0xfff6ec);
        this.ambientLight.intensity = 0.65;
      }
      if (this.ceilingLight) {
        this.ceilingLight.color.setHex(0xfff7ed);
        this.ceilingLight.intensity = 0.45;
      }
      this.scene.background = new THREE.Color(0x0a0e17);
    } else if (hour < 15.5) {
      // Midday Peak Sun (11:30 - 15:30)
      phaseName = 'Midday Peak Sun';
      if (this.sunLight) {
        this.sunLight.color.setHex(0xffffff);
        this.sunLight.intensity = 1.35;
      }
      if (this.ambientLight) {
        this.ambientLight.color.setHex(0xf8fafc);
        this.ambientLight.intensity = 0.70;
      }
      if (this.ceilingLight) {
        this.ceilingLight.intensity = 0.4;
      }
      this.scene.background = new THREE.Color(0x0a0e17);
    } else if (hour < 18.5) {
      // Golden Hour / Dusk (15:30 - 18:30)
      phaseName = 'Golden Hour Warm Glow';
      if (this.sunLight) {
        this.sunLight.color.setHex(0xf59e0b);
        this.sunLight.intensity = 1.05;
      }
      if (this.ambientLight) {
        this.ambientLight.color.setHex(0xfde68a);
        this.ambientLight.intensity = 0.52;
      }
      if (this.ceilingLight) {
        this.ceilingLight.color.setHex(0xffeedd);
        this.ceilingLight.intensity = 0.75;
      }
      this.scene.background = new THREE.Color(0x1a1524);
    } else {
      // Night Moonlight & Interior Ambience (18:30 - 22:00+)
      phaseName = 'Night Moonlight & Interior Ambience';
      if (this.sunLight) {
        this.sunLight.color.setHex(0x60a5fa);
        this.sunLight.intensity = 0.18;
      }
      if (this.ambientLight) {
        this.ambientLight.color.setHex(0x1e293b);
        this.ambientLight.intensity = 0.32;
      }
      if (this.ceilingLight) {
        this.ceilingLight.color.setHex(0xffe2b0);
        this.ceilingLight.intensity = 1.15; // Cozy glowing interior pendant and recessed lights
      }
      this.scene.background = new THREE.Color(0x060911);
    }

    if (timeDisplay) {
      timeDisplay.textContent = `${displayH}:${mStr} ${period} — ${phaseName}`;
    }

    // Sync Day/Night mode button icon/text
    const dayNightBtn = document.getElementById('btn-toggle-daylight');
    if (dayNightBtn) {
      if (hour >= 18.5 || hour < 6.5) {
        dayNightBtn.textContent = '🌙 Night';
        dayNightBtn.classList.remove('active');
      } else {
        dayNightBtn.textContent = '☀️ Day';
        dayNightBtn.classList.add('active');
      }
    }
  }

  // ==========================================
  // 13. REAL-TIME LASER MEASUREMENT TAPE TOOL
  // ==========================================
  initMeasureTool() {
    const btnToggle = document.getElementById('btn-toggle-measure');
    const hud = document.getElementById('measure-hud');
    const btnClear = document.getElementById('btn-clear-measures');
    const btnExit = document.getElementById('btn-exit-measure');

    btnToggle?.addEventListener('click', () => {
      this.toggleMeasureMode();
    });

    btnExit?.addEventListener('click', () => {
      this.toggleMeasureMode(false);
    });

    btnClear?.addEventListener('click', () => {
      this.clearAllMeasurements();
    });
  }

  toggleMeasureMode(forceState = null) {
    const btnToggle = document.getElementById('btn-toggle-measure');
    const hud = document.getElementById('measure-hud');
    const instruction = document.getElementById('measure-instruction');
    const liveDist = document.getElementById('measure-live-dist');

    this.isMeasuring = forceState !== null ? forceState : !this.isMeasuring;

    if (this.isMeasuring) {
      this.deselectObject();
      this.canvas.classList.add('measuring');
      if (hud) hud.style.display = 'flex';
      btnToggle?.classList.add('active');
      if (instruction) instruction.textContent = 'Click Point A on any wall, floor or furniture';
      if (liveDist) liveDist.style.display = 'none';
      this.measureStartPoint = null;
      this.showToast('📏 Laser Measure active: Click any point to measure');
    } else {
      this.canvas.classList.remove('measuring');
      if (hud) hud.style.display = 'none';
      btnToggle?.classList.remove('active');
      this.measureStartPoint = null;
      if (this.tempMeasureLine) {
        this.scene.remove(this.tempMeasureLine);
        this.tempMeasureLine = null;
      }
    }
  }

  getMeasurementRaycastHit(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const targets = [];
    if (this.furnitureGroup) targets.push(...this.furnitureGroup.children);
    if (this.roomBuilder) {
      if (this.roomBuilder.roomGroup) targets.push(this.roomBuilder.roomGroup);
      if (this.roomBuilder.houseFloors) targets.push(...this.roomBuilder.houseFloors);
      if (this.roomBuilder.houseWalls) targets.push(...this.roomBuilder.houseWalls);
      if (this.roomBuilder.floor) targets.push(this.roomBuilder.floor);
      if (this.roomBuilder.walls) {
        Object.values(this.roomBuilder.walls).forEach(w => { if (w) targets.push(w); });
      }
    }

    const hits = this.raycaster.intersectObjects(targets, true).filter(h => {
      return !h.object.userData?.isMeasureElement && !h.object.userData?.isRoomBadge;
    });

    return hits.length > 0 ? hits[0].point : null;
  }

  handleMeasureClick(e) {
    const hitPoint = this.getMeasurementRaycastHit(e);
    if (!hitPoint) return;

    const instruction = document.getElementById('measure-instruction');
    const liveDist = document.getElementById('measure-live-dist');

    if (!this.measureStartPoint) {
      // First click (Point A)
      this.measureStartPoint = hitPoint.clone();
      const markerA = this.createMeasurePointMarker(this.measureStartPoint, 0x10b981);
      this.measureMarkers.push(markerA);
      this.scene.add(markerA);

      if (instruction) instruction.textContent = 'Move mouse to Point B and click to finish';
    } else {
      // Second click (Point B)
      const endPoint = hitPoint.clone();
      const markerB = this.createMeasurePointMarker(endPoint, 0x38bdf8);
      this.measureMarkers.push(markerB);
      this.scene.add(markerB);

      const distance = this.measureStartPoint.distanceTo(endPoint);
      this.createCompletedMeasureLine(this.measureStartPoint, endPoint, distance);

      const mStr = `${distance.toFixed(2)} m`;
      const ftTotal = distance * 3.28084;
      const ft = Math.floor(ftTotal);
      const inches = Math.round((ftTotal - ft) * 12);
      const ftStr = `${ft}' ${inches}"`;

      this.showToast(`📏 Dimension Recorded: ${mStr} (${ftStr})`);

      if (instruction) instruction.textContent = `Measured: ${mStr} (${ftStr}) — Click next Point A`;
      if (liveDist) liveDist.style.display = 'none';

      if (this.tempMeasureLine) {
        this.scene.remove(this.tempMeasureLine);
        this.tempMeasureLine = null;
      }
      this.measureStartPoint = null;
    }
  }

  handleMeasureMove(e) {
    if (!this.measureStartPoint) return;

    const hitPoint = this.getMeasurementRaycastHit(e);
    if (!hitPoint) return;

    const distance = this.measureStartPoint.distanceTo(hitPoint);
    const liveDist = document.getElementById('measure-live-dist');
    if (liveDist) {
      liveDist.style.display = 'inline';
      const mStr = `${distance.toFixed(2)} m`;
      const ftTotal = distance * 3.28084;
      const ft = Math.floor(ftTotal);
      const inches = Math.round((ftTotal - ft) * 12);
      liveDist.textContent = `${mStr} (${ft}' ${inches}")`;
    }

    this.updateTempMeasureLine(this.measureStartPoint, hitPoint);
  }

  createMeasurePointMarker(pos, colorHex = 0x10b981) {
    const geom = new THREE.SphereGeometry(0.045, 16, 16);
    const mat = new THREE.MeshBasicMaterial({ color: colorHex, depthTest: false });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.copy(pos);
    mesh.renderOrder = 999;
    mesh.userData = { isMeasureElement: true };
    return mesh;
  }

  updateTempMeasureLine(start, end) {
    if (this.tempMeasureLine) {
      this.scene.remove(this.tempMeasureLine);
    }
    const geom = new THREE.BufferGeometry().setFromPoints([start, end]);
    const mat = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      dashSize: 0.1,
      gapSize: 0.05,
      depthTest: false
    });
    this.tempMeasureLine = new THREE.Line(geom, mat);
    this.tempMeasureLine.computeLineDistances();
    this.tempMeasureLine.renderOrder = 998;
    this.tempMeasureLine.userData = { isMeasureElement: true };
    this.scene.add(this.tempMeasureLine);
  }

  createCompletedMeasureLine(start, end, distance) {
    // 3D Laser Dimension Line
    const geom = new THREE.BufferGeometry().setFromPoints([start, end]);
    const mat = new THREE.LineBasicMaterial({ color: 0x10b981, linewidth: 2, depthTest: false });
    const line = new THREE.Line(geom, mat);
    line.renderOrder = 998;
    line.userData = { isMeasureElement: true };
    this.scene.add(line);
    this.measureLines.push(line);

    // Dimension Label Sprite at Midpoint
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    mid.y += 0.08; // Slight elevation so it floats clearly above surface

    const mStr = `${distance.toFixed(2)} m`;
    const ftTotal = distance * 3.28084;
    const ft = Math.floor(ftTotal);
    const inches = Math.round((ftTotal - ft) * 12);
    const labelText = `${mStr} (${ft}' ${inches}")`;

    const sprite = this.createMeasureLabelSprite(labelText);
    sprite.position.copy(mid);
    this.scene.add(sprite);
    this.measureSprites.push(sprite);
  }

  createMeasureLabelSprite(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(3, 3, 250, 58, 10);
    else ctx.rect(3, 3, 250, 58);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#6ee7b7';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: texture, depthTest: false, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(0.85, 0.22, 1.0);
    sprite.renderOrder = 999;
    sprite.userData = { isMeasureElement: true };
    return sprite;
  }

  clearAllMeasurements() {
    this.measureMarkers.forEach(m => this.scene.remove(m));
    this.measureLines.forEach(l => this.scene.remove(l));
    this.measureSprites.forEach(s => this.scene.remove(s));
    if (this.tempMeasureLine) {
      this.scene.remove(this.tempMeasureLine);
      this.tempMeasureLine = null;
    }
    this.measureMarkers = [];
    this.measureLines = [];
    this.measureSprites = [];
    this.measureStartPoint = null;

    const instruction = document.getElementById('measure-instruction');
    const liveDist = document.getElementById('measure-live-dist');
    if (instruction) instruction.textContent = 'All measurements cleared. Click Point A to start';
    if (liveDist) liveDist.style.display = 'none';
    this.showToast('🗑️ Measurement lines cleared');
  }

  // ==========================================
  // 14. ROOM DIMENSIONS & AREA SCHEDULE
  // ==========================================
  initRoomSchedule() {
    const btnOpen = document.getElementById('btn-room-schedule');
    const modal = document.getElementById('schedule-modal');
    const btnClose = document.getElementById('btn-close-schedule');
    const btnDismiss = document.getElementById('btn-dismiss-schedule');
    const btnMetric = document.getElementById('btn-unit-metric');
    const btnImperial = document.getElementById('btn-unit-imperial');
    const chk3DAreas = document.getElementById('chk-show-3d-areas');

    btnOpen?.addEventListener('click', () => {
      this.updateRoomScheduleData();
      if (modal) modal.style.display = 'flex';
    });

    const closeModal = () => {
      if (modal) modal.style.display = 'none';
    };

    btnClose?.addEventListener('click', closeModal);
    btnDismiss?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    btnMetric?.addEventListener('click', () => {
      this.scheduleUnit = 'metric';
      btnMetric.classList.add('active');
      btnImperial?.classList.remove('active');
      this.updateRoomScheduleData();
      if (this.show3DAreaBadges) this.toggleFloorAreaBadges(true);
    });

    btnImperial?.addEventListener('click', () => {
      this.scheduleUnit = 'imperial';
      btnImperial.classList.add('active');
      btnMetric?.classList.remove('active');
      this.updateRoomScheduleData();
      if (this.show3DAreaBadges) this.toggleFloorAreaBadges(true);
    });

    chk3DAreas?.addEventListener('change', (e) => {
      this.show3DAreaBadges = e.target.checked;
      this.toggleFloorAreaBadges(this.show3DAreaBadges);
    });
  }

  getRoomScheduleList() {
    const isDuplex = this.roomBuilder && (this.roomBuilder.houseType === 'duplex' || this.roomBuilder.houseType === 'duplex_villa');
    const is3BHK = this.roomBuilder && (this.roomBuilder.houseType === '3bhk' || this.roomBuilder.houseType === 'complete_house_3bhk');
    const isVilla = this.roomBuilder && (this.roomBuilder.houseType === 'villa_2bhk' || this.roomBuilder.houseType === '2bhk' || this.roomBuilder.houseType === 'villa');
    
    // Flooring label lookup
    const floorSelect = document.getElementById('flooring-select');
    const currentFloorText = floorSelect ? floorSelect.options[floorSelect.selectedIndex]?.text : 'Continuous Light Porcelain Tile';

    if (isDuplex) {
      return {
        houseType: 'Modern Duplex Villa (Double-Height Living & Mezzanine Penthouse)',
        totalBuiltUp: 240.0,
        carpetArea: 168.5,
        rooms: [
          { name: '🚪 Grand Entrance Foyer', width: 2.8, length: 3.2, height: 2.8, floor: 'Polished Marble' },
          { name: '🛋️ Double-Height Living Lounge', width: 5.4, length: 5.4, height: 5.6, floor: 'Polished Marble' },
          { name: '🍽️ Formal Dining Room', width: 4.3, length: 4.6, height: 2.8, floor: 'Polished Marble' },
          { name: '🍳 Gourmet Island Kitchen', width: 4.3, length: 4.6, height: 2.8, floor: 'Light Porcelain Tile' },
          { name: '🛏️ Ground Guest Suite', width: 4.7, length: 5.0, height: 2.8, floor: 'Warm Oak Wood' },
          { name: '🚿 Ground Guest Bathroom', width: 2.6, length: 3.0, height: 2.8, floor: 'Blue Designer Tile' },
          { name: '🪜 Floating Cantilevered Stairs', width: 1.1, length: 4.2, height: 2.8, floor: 'Solid Oak Treads & Glass Rail' },
          { name: '✨ Mezzanine Walkway Gallery (Lvl 2)', width: 1.8, length: 4.8, height: 2.8, floor: 'Herringbone Parquet' },
          { name: '👑 Penthouse Master Suite (Lvl 2)', width: 4.3, length: 5.4, height: 2.8, floor: 'Herringbone Parquet' },
          { name: '🛁 Master Spa Bathroom (Lvl 2)', width: 4.3, length: 3.0, height: 2.8, floor: 'Polished Marble Tile' },
          { name: '🌆 Upper Loft Sky Lounge (Lvl 2)', width: 6.0, length: 6.0, height: 2.8, floor: 'Herringbone Parquet' },
          { name: '🌿 Sunken Terrace & Deck', width: 4.3, length: 2.0, height: 2.8, floor: 'Outdoor Teak Decking' }
        ]
      };
    } else if (is3BHK) {
      return {
        houseType: 'Luxury 3 BHK Residence (10 Connected Spaces & Balcony)',
        totalBuiltUp: 215.0,
        carpetArea: 148.2,
        rooms: [
          { name: '🚪 Entrance Foyer', width: 3.0, length: 3.0, height: 2.8, floor: currentFloorText },
          { name: '🛋️ Living Room Lounge', width: 6.0, length: 4.6, height: 2.8, floor: currentFloorText },
          { name: '🍽️ Dining Pavilion', width: 5.0, length: 4.6, height: 2.8, floor: currentFloorText },
          { name: '🍳 Modular Kitchen & Island', width: 5.0, length: 4.4, height: 2.8, floor: currentFloorText },
          { name: '👑 Master Suite (Bed 1)', width: 5.0, length: 5.4, height: 2.8, floor: 'Herringbone Parquet' },
          { name: '🛁 Master En-Suite Bathroom', width: 2.4, length: 2.8, height: 2.8, floor: 'Blue Designer Tile' },
          { name: '🛏️ Second Bedroom (Bed 2)', width: 5.0, length: 5.4, height: 2.8, floor: 'Warm Oak Wood' },
          { name: '🧸 Third Bedroom / Study (Bed 3)', width: 4.0, length: 4.4, height: 2.8, floor: 'Warm Oak Wood' },
          { name: '🚿 Common Family Bathroom', width: 2.5, length: 2.8, height: 2.8, floor: 'Blue Designer Tile' },
          { name: '🚶 Central Hallway Corridor', width: 3.5, length: 4.4, height: 2.8, floor: currentFloorText },
          { name: '🌅 Private Balcony Deck', width: 6.0, length: 2.0, height: 2.8, floor: 'Teak Wood Decking' }
        ]
      };
    } else if (isVilla) {
      return {
        houseType: 'Complete House Residence (2 BHK Villa)',
        totalBuiltUp: 182.0,
        carpetArea: 117.8,
        rooms: [
          { name: '🚪 Entrance Foyer', width: 2.4, length: 2.8, height: 2.8, floor: currentFloorText },
          { name: '🛋️ Living Room Suite', width: 5.4, length: 4.8, height: 2.8, floor: currentFloorText },
          { name: '🍽️ Dining Area', width: 3.8, length: 3.4, height: 2.8, floor: currentFloorText },
          { name: '🍳 Modular Kitchen', width: 3.8, length: 3.6, height: 2.8, floor: 'Modern Ceramic Tile' },
          { name: '👑 Master Bedroom Suite', width: 4.6, length: 4.2, height: 2.8, floor: 'Light Oak Wood Parquet' },
          { name: '🛁 Master Ensuite Bathroom', width: 2.8, length: 2.4, height: 2.8, floor: 'Porcelain Marble Tile' },
          { name: '🛏️ Second Bedroom', width: 4.0, length: 3.6, height: 2.8, floor: 'Light Oak Wood Parquet' },
          { name: '🚿 Common Bathroom', width: 2.4, length: 2.2, height: 2.8, floor: 'Porcelain Marble Tile' },
          { name: '🌿 Terrace & Garden', width: 5.2, length: 3.5, height: 2.8, floor: 'Outdoor Paving & Turf' }
        ]
      };
    } else {
      return {
        houseType: 'Single Bedroom House (1 BHK Planned Architecture)',
        totalBuiltUp: 105.0,
        carpetArea: 88.1,
        rooms: [
          { name: '🚪 Entrance Foyer', width: 2.4, length: 2.8, height: 2.8, floor: currentFloorText },
          { name: '🛋️ Living Room', width: 5.2, length: 4.8, height: 2.8, floor: currentFloorText },
          { name: '🍽️ Dining Area', width: 3.8, length: 3.2, height: 2.8, floor: currentFloorText },
          { name: '🍳 Modular Kitchen', width: 3.8, length: 3.6, height: 2.8, floor: currentFloorText },
          { name: '👑 Master Bedroom Suite', width: 4.5, length: 4.0, height: 2.8, floor: currentFloorText },
          { name: '🛁 Master Bathroom', width: 2.8, length: 2.4, height: 2.8, floor: 'Waterproof Floor Tile' },
          { name: '🚶 Internal Hallway & Privacy Corridor', width: 1.4, length: 4.2, height: 2.8, floor: currentFloorText }
        ]
      };
    }
  }

  updateRoomScheduleData() {
    const data = this.getRoomScheduleList();
    const isMetric = this.scheduleUnit === 'metric';

    // Update house type badge
    const badge = document.getElementById('schedule-house-type-badge');
    if (badge) badge.textContent = data.houseType;

    // Convert areas
    const formatArea = (sqm) => {
      if (isMetric) return `${sqm.toFixed(1)} m²`;
      const sqft = sqm * 10.7639;
      return `${sqft.toFixed(0)} sq ft`;
    };

    const formatDim = (m) => {
      if (isMetric) return `${m.toFixed(2)}m`;
      const ftTotal = m * 3.28084;
      const ft = Math.floor(ftTotal);
      const inc = Math.round((ftTotal - ft) * 12);
      return `${ft}' ${inc}"`;
    };

    // Summary stats
    const totalEl = document.getElementById('sched-stat-total');
    const carpetEl = document.getElementById('sched-stat-carpet');
    const roomsEl = document.getElementById('sched-stat-rooms');

    if (totalEl) totalEl.textContent = formatArea(data.totalBuiltUp);
    if (carpetEl) carpetEl.textContent = formatArea(data.carpetArea);
    if (roomsEl) roomsEl.textContent = `${data.rooms.length} Spaces`;

    // Table rows
    const tbody = document.getElementById('schedule-table-rows');
    if (!tbody) return;
    tbody.innerHTML = '';

    data.rooms.forEach(r => {
      const area = r.width * r.length;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td style="font-weight: 600; color: #f1f5f9;">${r.name}</td>
        <td>${formatDim(r.width)} &times; ${formatDim(r.length)}</td>
        <td style="font-weight: 600; color: #38bdf8;">${formatArea(area)}</td>
        <td>${formatDim(r.height)}</td>
        <td style="color: #94a3b8; font-size: 11px;">${r.floor}</td>
      `;
      tbody.appendChild(row);
    });
  }

  toggleFloorAreaBadges(enabled) {
    if (!this.roomBuilder || !this.roomBuilder.roomBadges) return;
    const isMetric = this.scheduleUnit === 'metric';

    const roomAreaMap = {
      foyer: 6.7,
      living: 25.0,
      dining: 12.2,
      kitchen: 13.7,
      bedroom: 18.0,
      bedroom2: 14.4,
      master_bath: 6.7,
      common_bath: 5.3,
      backyard: 18.2
    };

    this.roomBuilder.roomBadges.forEach(badge => {
      const zoneKey = badge.userData?.roomZone;
      const baseTitle = badge.userData?.title || '';
      const areaM2 = roomAreaMap[zoneKey];
      if (!areaM2) return;

      const areaStr = isMetric ? `${areaM2.toFixed(1)} m²` : `${Math.round(areaM2 * 10.7639)} sq ft`;
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 140;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.strokeStyle = enabled ? '#10b981' : 'rgba(99, 102, 241, 0.85)';
      ctx.lineWidth = 6;
      const r = 26;
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(512 - r, 0);
      ctx.quadraticCurveTo(512, 0, 512, r);
      ctx.lineTo(512, 140 - r);
      ctx.quadraticCurveTo(512, 140, 512 - r, 140);
      ctx.lineTo(r, 140);
      ctx.quadraticCurveTo(0, 140, 0, 140 - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (enabled) {
        ctx.fillText(baseTitle, 256, 50);
        ctx.fillStyle = '#34d399';
        ctx.font = '600 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(areaStr, 256, 95);
      } else {
        ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(baseTitle, 256, 70);
      }

      if (badge.material && badge.material.map) {
        badge.material.map.dispose();
        badge.material.map = new THREE.CanvasTexture(canvas);
        badge.material.map.needsUpdate = true;
      }
    });

    this.showToast(enabled ? '📐 3D Room Area Badges enabled' : '📐 3D Room Area Badges hidden');
  }

  // ==========================================
  // 15. ADVANCED EXPORTS: 360° VR PANORAMA & .OBJ + .MTL
  // ==========================================
  initExportTools() {
    const btnObj = document.getElementById('btn-export-obj');
    const btnPano = document.getElementById('btn-export-panorama');

    btnObj?.addEventListener('click', () => {
      this.export3DModelOBJ();
    });

    btnPano?.addEventListener('click', () => {
      this.export360Panorama();
    });
  }

  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);
  }

  export360Panorama() {
    this.showToast('🌐 Generating 360° Equirectangular Panorama render...');

    try {
      // Hide helpers and selection highlights during render
      const selVisible = this.selectionHelper ? this.selectionHelper.visible : false;
      if (this.selectionHelper) this.selectionHelper.visible = false;
      const badgesVisible = (this.roomBuilder?.roomBadges || []).map(b => {
        const v = b.visible;
        b.visible = false;
        return { badge: b, visible: v };
      });

      // 1. Setup CubeCamera at eye level in the center of current space
      const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(1024, {
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter,
        magFilter: THREE.LinearFilter
      });
      const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);

      // Camera position: use current camera x/z, clamped inside house at eye level (y = 1.6)
      cubeCamera.position.set(this.camera.position.x, 1.6, this.camera.position.z);
      this.scene.add(cubeCamera);
      cubeCamera.update(this.renderer, this.scene);

      // 2. Render CubeMap into Equirectangular 2:1 Texture (2048 x 1024)
      const panoWidth = 2048;
      const panoHeight = 1024;
      const panoRenderTarget = new THREE.WebGLRenderTarget(panoWidth, panoHeight);

      // Equirectangular projection camera & scene
      const panoScene = new THREE.Scene();
      const panoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const panoVertexShader = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `;

      const panoFragmentShader = `
        uniform samplerCube tCube;
        varying vec2 vUv;
        #define M_PI 3.1415926535897932384626433832795
        void main() {
          float phi = (vUv.x - 0.5) * 2.0 * M_PI;
          float theta = (0.5 - vUv.y) * M_PI;
          vec3 dir = vec3(sin(phi) * cos(theta), sin(theta), -cos(phi) * cos(theta));
          gl_FragColor = textureCube(tCube, dir);
        }
      `;

      const panoMaterial = new THREE.ShaderMaterial({
        vertexShader: panoVertexShader,
        fragmentShader: panoFragmentShader,
        uniforms: {
          tCube: { value: cubeRenderTarget.texture }
        }
      });

      const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), panoMaterial);
      panoScene.add(quad);

      // Render to panoRenderTarget
      this.renderer.setRenderTarget(panoRenderTarget);
      this.renderer.render(panoScene, panoCamera);

      // Read back pixels
      const pixelBuffer = new Uint8Array(panoWidth * panoHeight * 4);
      this.renderer.readRenderTargetPixels(panoRenderTarget, 0, 0, panoWidth, panoHeight, pixelBuffer);

      // Reset renderer target
      this.renderer.setRenderTarget(null);

      // Copy pixels into an offscreen HTML5 canvas to export as JPEG
      const canvas = document.createElement('canvas');
      canvas.width = panoWidth;
      canvas.height = panoHeight;
      const ctx = canvas.getContext('2d');
      const imgData = ctx.createImageData(panoWidth, panoHeight);

      // Invert vertical rows (WebGL coordinates are Y-flipped)
      for (let y = 0; y < panoHeight; y++) {
        const srcRow = (panoHeight - 1 - y) * panoWidth * 4;
        const dstRow = y * panoWidth * 4;
        for (let x = 0; x < panoWidth * 4; x++) {
          imgData.data[dstRow + x] = pixelBuffer[srcRow + x];
        }
      }
      ctx.putImageData(imgData, 0, 0);

      // Trigger download
      canvas.toBlob((blob) => {
        if (blob) {
          this.downloadBlob(blob, `interior-360-panorama-${new Date().toISOString().slice(0, 10)}.jpg`);
          this.showToast('✨ 360° VR Panorama downloaded! (Ready for VR & Facebook 360)');
        }
      }, 'image/jpeg', 0.95);

      // Cleanup
      this.scene.remove(cubeCamera);
      cubeRenderTarget.dispose();
      panoRenderTarget.dispose();
      panoMaterial.dispose();
      quad.geometry.dispose();

      // Restore hidden helpers
      if (this.selectionHelper) this.selectionHelper.visible = selVisible;
      badgesVisible.forEach(item => { item.badge.visible = item.visible; });
    } catch (err) {
      console.error('Panorama export failed:', err);
      this.showToast('⚠️ Could not complete 360° export: ' + err.message);
    }
  }

  export3DModelOBJ() {
    this.showToast('📦 Serializing complete 3D scene to Wavefront (.OBJ + .MTL)...');

    try {
      let objOutput = '# AI Interior Studio - Architectural 3D House Export\n';
      objOutput += '# Exported from Three.js scene\n';
      objOutput += 'mtllib interior-materials.mtl\n\n';

      let mtlOutput = '# Materials library for AI Interior Studio\n\n';

      const materialsMap = new Map();
      let vertexOffset = 1;
      let normalOffset = 1;
      let uvOffset = 1;

      // Meshes to export: room geometry + furniture geometry
      const exportRoots = [this.furnitureGroup, this.roomBuilder?.roomGroup].filter(Boolean);

      exportRoots.forEach(root => {
        root.updateMatrixWorld(true);
        root.traverse(child => {
          if (!child.isMesh || !child.geometry) return;
          if (child.userData?.isMeasureElement || child.userData?.isRoomBadge) return;
          if (child.name === 'SelectionBox' || child.name === 'MeasurementGrid') return;

          const geom = child.geometry.clone();
          geom.applyMatrix4(child.matrixWorld);

          const positions = geom.attributes.position;
          const normals = geom.attributes.normal;
          const uvs = geom.attributes.uv;

          if (!positions) return;

          // Material export
          const mat = Array.isArray(child.material) ? child.material[0] : child.material;
          const matName = mat ? (mat.name || `Mat_${mat.id || 'std'}`) : 'DefaultMaterial';

          if (mat && !materialsMap.has(matName)) {
            materialsMap.set(matName, true);
            const col = mat.color ? mat.color : { r: 0.8, g: 0.8, b: 0.8 };
            const op = mat.opacity !== undefined ? mat.opacity : 1.0;
            mtlOutput += `newmtl ${matName}\n`;
            mtlOutput += `Kd ${col.r.toFixed(4)} ${col.g.toFixed(4)} ${col.b.toFixed(4)}\n`;
            mtlOutput += `Ks 0.2000 0.2000 0.2000\n`;
            mtlOutput += `Ns 25.0\n`;
            mtlOutput += `d ${op.toFixed(2)}\n`;
            mtlOutput += `illum 2\n\n`;
          }

          objOutput += `o ${child.name || 'HouseMesh_' + child.id}\n`;
          objOutput += `usemtl ${matName}\n`;

          // Write vertices
          for (let i = 0; i < positions.count; i++) {
            objOutput += `v ${positions.getX(i).toFixed(4)} ${positions.getY(i).toFixed(4)} ${positions.getZ(i).toFixed(4)}\n`;
          }

          // Write normals
          if (normals) {
            for (let i = 0; i < normals.count; i++) {
              objOutput += `vn ${normals.getX(i).toFixed(4)} ${normals.getY(i).toFixed(4)} ${normals.getZ(i).toFixed(4)}\n`;
            }
          }

          // Write UVs
          if (uvs) {
            for (let i = 0; i < uvs.count; i++) {
              objOutput += `vt ${uvs.getX(i).toFixed(4)} ${uvs.getY(i).toFixed(4)}\n`;
            }
          }

          // Write faces
          const hasNormals = Boolean(normals);
          const hasUvs = Boolean(uvs);

          if (geom.index) {
            const indices = geom.index.array;
            for (let i = 0; i < indices.length; i += 3) {
              const a = indices[i] + vertexOffset;
              const b = indices[i + 1] + vertexOffset;
              const c = indices[i + 2] + vertexOffset;
              if (hasNormals && hasUvs) {
                const na = indices[i] + normalOffset;
                const nb = indices[i + 1] + normalOffset;
                const nc = indices[i + 2] + normalOffset;
                const ua = indices[i] + uvOffset;
                const ub = indices[i + 1] + uvOffset;
                const uc = indices[i + 2] + uvOffset;
                objOutput += `f ${a}/${ua}/${na} ${b}/${ub}/${nb} ${c}/${uc}/${nc}\n`;
              } else if (hasNormals) {
                const na = indices[i] + normalOffset;
                const nb = indices[i + 1] + normalOffset;
                const nc = indices[i + 2] + normalOffset;
                objOutput += `f ${a}//${na} ${b}//${nb} ${c}//${nc}\n`;
              } else {
                objOutput += `f ${a} ${b} ${c}\n`;
              }
            }
          } else {
            for (let i = 0; i < positions.count; i += 3) {
              const a = i + vertexOffset;
              const b = i + 1 + vertexOffset;
              const c = i + 2 + vertexOffset;
              if (hasNormals && hasUvs) {
                const na = i + normalOffset;
                const nb = i + 1 + normalOffset;
                const nc = i + 2 + normalOffset;
                const ua = i + uvOffset;
                const ub = i + 1 + uvOffset;
                const uc = i + 2 + uvOffset;
                objOutput += `f ${a}/${ua}/${na} ${b}/${ub}/${nb} ${c}/${uc}/${nc}\n`;
              } else if (hasNormals) {
                const na = i + normalOffset;
                const nb = i + 1 + normalOffset;
                const nc = i + 2 + normalOffset;
                objOutput += `f ${a}//${na} ${b}//${nb} ${c}//${nc}\n`;
              } else {
                objOutput += `f ${a} ${b} ${c}\n`;
              }
            }
          }

          vertexOffset += positions.count;
          if (normals) normalOffset += normals.count;
          if (uvs) uvOffset += uvs.count;

          geom.dispose();
        });
      });

      // Download both OBJ and MTL
      const objBlob = new Blob([objOutput], { type: 'text/plain' });
      const mtlBlob = new Blob([mtlOutput], { type: 'text/plain' });

      this.downloadBlob(objBlob, 'interior-architecture-model.obj');
      setTimeout(() => {
        this.downloadBlob(mtlBlob, 'interior-materials.mtl');
      }, 300);

      this.showToast('✅ 3D Model (.OBJ + .MTL) exported for Blender / 3ds Max / SketchUp!');
    } catch (err) {
      console.error('OBJ Export failed:', err);
      this.showToast('⚠️ Export failed: ' + err.message);
    }
  }
}

// Instantiate App once DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  window.interiorAppInstance = new App();
});
