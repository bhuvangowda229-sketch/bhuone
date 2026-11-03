// Interactive Live 3D Hero Demo for Landing Page
import { RoomBuilder } from './room-model.js';
import { FurnitureFactory } from './furniture-models.js';
import { AIEngine } from './ai-engine.js';

class HeroDemo {
  constructor() {
    this.canvas = document.getElementById('heroCanvas');
    if (!this.canvas) return;

    this.furnitureGroup = new THREE.Group();
    this.currentStyle = 'modern';
    this.isDay = true;

    this.initScene();
    this.initLights();
    this.initRoom();
    this.loadStyle('modern');
    this.initEvents();

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initScene() {
    const width = this.canvas.parentElement.clientWidth;
    const height = this.canvas.parentElement.clientHeight || 520;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0f1d);

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 4.2, 6.2);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
    this.controls.minDistance = 3.0;
    this.controls.maxDistance = 14.0;
    this.controls.target.set(0, 0.9, 0);

    this.scene.add(this.furnitureGroup);

    window.addEventListener('resize', () => {
      const w = this.canvas.parentElement.clientWidth;
      const h = this.canvas.parentElement.clientHeight || 520;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  initLights() {
    this.ambient = new THREE.AmbientLight(0xffffff, 0.55);
    this.scene.add(this.ambient);

    this.sun = new THREE.DirectionalLight(0xfff7ed, 1.2);
    this.sun.position.set(-6, 8, 4);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024, 1024);
    this.sun.shadow.bias = -0.0005;
    this.scene.add(this.sun);

    this.point = new THREE.PointLight(0xffedd5, 0.5, 10);
    this.point.position.set(0, 2.5, 0);
    this.scene.add(this.point);
  }

  initRoom() {
    this.roomBuilder = new RoomBuilder(this.scene);
  }

  loadStyle(style) {
    this.currentStyle = style;

    // Clear previous
    while (this.furnitureGroup.children.length > 0) {
      this.furnitureGroup.remove(this.furnitureGroup.children[0]);
    }

    const pref = {
      roomType: 'living_room',
      dimensions: { width: 5.0, length: 4.2, height: 2.8 },
      style: style,
      colorScheme: style === 'luxury' ? 'dark_luxury' : (style === 'minimalist' ? 'cool_scandi' : 'warm_neutral'),
      flooring: style === 'luxury' ? 'marble' : (style === 'minimalist' ? 'tile' : 'wood_oak'),
      lighting: 'warm_ambient'
    };

    this.roomBuilder.buildRoom(pref.dimensions, 0xf8fafc, pref.flooring);
    const plan = AIEngine.generateAlgorithmicDesign(pref);
    this.roomBuilder.setWallColor(plan.wallColorHex);

    plan.items.forEach(item => {
      let mesh = null;
      switch (item.type) {
        case 'sofa': mesh = FurnitureFactory.createSofa(style, item.color); break;
        case 'coffee_table': mesh = FurnitureFactory.createCoffeeTable(style, item.color); break;
        case 'tv_unit': mesh = FurnitureFactory.createTVUnit(style); break;
        case 'missouri_tv_unit': mesh = FurnitureFactory.createMissouriTVUnit(style, item.color); break;
        case 'armchair': mesh = FurnitureFactory.createArmchair(style, item.color); break;
        case 'floor_lamp': mesh = FurnitureFactory.createFloorLamp(style); break;
        case 'plant': mesh = FurnitureFactory.createPlant(); break;
        case 'wall_art': mesh = FurnitureFactory.createWallArt(style); break;
        case 'bookshelf': mesh = FurnitureFactory.createBookshelf(style); break;
        case 'rug': mesh = FurnitureFactory.createRug(2.4, 1.8, style); break;
      }
      if (mesh) {
        if (item.position) mesh.position.set(...item.position);
        if (item.rotation) mesh.rotation.set(...item.rotation);
        this.furnitureGroup.add(mesh);
      }
    });
  }

  initEvents() {
    // Style toggle buttons in demo header
    document.querySelectorAll('[data-demo-style]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-demo-style]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.loadStyle(btn.dataset.demoStyle);

        // Also sync style preview cards below
        document.querySelectorAll('.style-preview-card').forEach(card => {
          card.classList.toggle('active', card.dataset.style === btn.dataset.demoStyle);
        });
      });
    });

    // Style preview cards in the showcase section
    document.querySelectorAll('.style-preview-card').forEach(card => {
      card.addEventListener('click', () => {
        const style = card.dataset.style;
        document.querySelectorAll('.style-preview-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        document.querySelectorAll('[data-demo-style]').forEach(b => {
          b.classList.toggle('active', b.dataset.demoStyle === style);
        });

        this.loadStyle(style);

        // Smoothly scroll to demo
        document.getElementById('demo-section').scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Day/Night toggle
    const toggleDay = document.getElementById('demo-day-toggle');
    if (toggleDay) {
      toggleDay.addEventListener('click', () => {
        this.isDay = !this.isDay;
        toggleDay.classList.toggle('active', this.isDay);
        toggleDay.textContent = this.isDay ? '☀️ Day' : '🌙 Night';
        if (this.isDay) {
          this.scene.background.set(0x0a0f1d);
          this.ambient.intensity = 0.55;
          this.sun.intensity = 1.2;
        } else {
          this.scene.background.set(0x020408);
          this.ambient.intensity = 0.15;
          this.sun.intensity = 0.05;
        }
      });
    }

    // Top view toggle
    const topBtn = document.getElementById('demo-top-toggle');
    if (topBtn) {
      topBtn.addEventListener('click', () => {
        topBtn.classList.toggle('active');
        if (topBtn.classList.contains('active')) {
          this.camera.position.set(0, 8.5, 0.001);
          this.controls.target.set(0, 0, 0);
        } else {
          this.camera.position.set(0, 4.2, 6.2);
          this.controls.target.set(0, 0.9, 0);
        }
        this.controls.update();
      });
    }

    // Require login before proceeding to 3D studio
    document.querySelectorAll('a[href*="studio.html"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const user = localStorage.getItem('ai_interior_user');
        if (!user) {
          e.preventDefault();
          window.location.href = 'login.html?redirect=studio.html';
        }
      });
    });

    // Check user session and adjust navbar
    try {
      const stored = localStorage.getItem('ai_interior_user');
      const userLoginLink = document.getElementById('nav-user-login-link');
      const adminLoginLink = document.getElementById('nav-admin-login-link');
      const signupLink = document.getElementById('nav-signup-link');

      if (stored) {
        const user = JSON.parse(stored);
        const isAdmin = user.role === 'admin' && user.email && user.email.toLowerCase() === 'bhuvan@gmail.com';

        if (userLoginLink) {
          userLoginLink.innerHTML = `${isAdmin ? '👑' : '👤'} Hi, ${user.name.split(' ')[0]}`;
          userLoginLink.href = isAdmin ? 'admin.html' : 'studio.html';
          userLoginLink.title = `Signed in as ${user.name} (${user.email || ''})`;
          userLoginLink.style.borderColor = isAdmin ? 'rgba(245, 158, 11, 0.4)' : 'rgba(99, 102, 241, 0.4)';
          userLoginLink.style.color = isAdmin ? '#fbbf24' : '#fff';
        }

        if (adminLoginLink) {
          if (isAdmin) {
            adminLoginLink.innerHTML = '<span>⚙️</span> Dashboard';
            adminLoginLink.href = 'admin.html';
            adminLoginLink.style.display = 'inline-flex';
          } else {
            adminLoginLink.style.display = 'none';
          }
        }

        if (signupLink) {
          signupLink.innerHTML = '<span>🚪</span> Sign Out';
          signupLink.href = '#';
          signupLink.style.borderColor = 'rgba(239, 68, 68, 0.3)';
          signupLink.style.background = 'rgba(239, 68, 68, 0.08)';
          signupLink.style.color = '#fca5a5';
          signupLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('ai_interior_user');
            window.location.reload();
          });
        }
      } else {
        if (userLoginLink) userLoginLink.style.display = 'inline-flex';
        if (adminLoginLink) adminLoginLink.style.display = 'inline-flex';
        if (signupLink) signupLink.style.display = 'inline-flex';
      }
    } catch (e) {}
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new HeroDemo();
});
