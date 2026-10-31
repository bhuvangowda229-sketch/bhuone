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
    this.selectedObject = null;
    this.isDaylight = true;
    this.currentStyle = 'modern';
    this.geminiApiKey = localStorage.getItem('ai_interior_gemini_key') || '';

    this.initScene();
    this.initLights();
    this.initRoom();
    this.initRaycasting();
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

  // 4. RAYCASTING & OBJECT SELECTION
  initRaycasting() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.canvas.addEventListener('pointerdown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.furnitureGroup.children, true);

      if (intersects.length > 0) {
        // Find top-level furniture group
        let obj = intersects[0].object;
        while (obj.parent && obj.parent !== this.furnitureGroup) {
          obj = obj.parent;
        }
        this.selectObject(obj);
      } else {
        // Clicked empty space
        this.deselectObject();
      }
    });
  }

  selectObject(obj) {
    this.deselectObject();
    this.selectedObject = obj;

    // Show popup
    const popup = document.getElementById('inspector-popup');
    const title = document.getElementById('inspector-title');
    const posX = document.getElementById('inspect-pos-x');
    const posZ = document.getElementById('inspect-pos-z');

    popup.style.display = 'flex';
    title.textContent = obj.name || 'Selected Object';
    posX.value = obj.position.x;
    posZ.value = obj.position.z;

    this.showToast(`Selected: ${obj.name}`);
  }

  deselectObject() {
    this.selectedObject = null;
    document.getElementById('inspector-popup').style.display = 'none';
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
    document.getElementById('btn-close-inspector').addEventListener('click', () => {
      this.deselectObject();
    });

    document.getElementById('inspect-pos-x').addEventListener('input', (e) => {
      if (this.selectedObject) this.selectedObject.position.x = parseFloat(e.target.value);
    });

    document.getElementById('inspect-pos-z').addEventListener('input', (e) => {
      if (this.selectedObject) this.selectedObject.position.z = parseFloat(e.target.value);
    });

    document.getElementById('btn-rotate-object').addEventListener('click', () => {
      if (this.selectedObject) {
        this.selectedObject.rotation.y += Math.PI / 4;
      }
    });

    document.getElementById('btn-delete-object').addEventListener('click', () => {
      if (this.selectedObject) {
        this.furnitureGroup.remove(this.selectedObject);
        this.deselectObject();
        this.showToast('Object removed from room');
      }
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

  // 6. CAMERA PRESETS
  setCameraPreset(mode) {
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
      case 'walk':
        // Eye-level walk-in view
        this.camera.position.set(0, 1.4, 2.0);
        this.controls.target.set(0, 1.3, -1.5);
        break;
      case '3d':
      default:
        // Free 3D Orbit
        this.camera.position.set(0, 4.5, 6.8);
        this.controls.target.set(0, 1.0, 0);
        break;
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
    this.roomBuilder.buildRoom(pref.dimensions, 0xfaf5ee, pref.flooring);

    // 2. Clear old furniture
    while (this.furnitureGroup.children.length > 0) {
      this.furnitureGroup.remove(this.furnitureGroup.children[0]);
    }
    this.deselectObject();

    // 3. Generate AI recommendations
    const designPlan = await AIEngine.generateDesign(pref, this.geminiApiKey);

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
      case 'dining_set':
        meshGroup = FurnitureFactory.createDiningSet(style, itemData.color);
        break;
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

  // 9. SNAPSHOT EXPORT
  captureSnapshot() {
    this.renderer.render(this.scene, this.camera);
    const dataURL = this.canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `ai-interior-design-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
    this.showToast('High-resolution 3D snapshot saved!');
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

  // 12. ANIMATION LOOP
  animate() {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// Instantiate App once DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
