/**
 * AI Interior Studio - Login & Authentication Controller
 * Theme-matching interactive 3D background & session management
 */

class AuthManager {
  constructor() {
    this.mode = 'signin'; // 'signin' or 'signup'
    this.redirectUrl = this.getRedirectTarget();

    this.initElements();
    this.initEvents();
    this.checkExistingSession();
    this.init3DBackground();
  }

  getRedirectTarget() {
    const params = new URLSearchParams(window.location.search);
    return params.get('redirect') || 'studio.html';
  }

  initElements() {
    this.title = document.getElementById('auth-main-title');
    this.subtitle = document.getElementById('auth-main-subtitle');
    this.tabSignIn = document.getElementById('tab-signin-btn');
    this.tabSignUp = document.getElementById('tab-signup-btn');
    this.fieldName = document.getElementById('field-name');
    this.optionsRow = document.getElementById('auth-options-row');
    this.submitLabel = document.getElementById('submit-label');
    this.form = document.getElementById('auth-form');
    this.inputName = document.getElementById('input-name');
    this.inputEmail = document.getElementById('input-email');
    this.inputPassword = document.getElementById('input-password');
    this.btnTogglePwd = document.getElementById('btn-toggle-pwd');
    this.btnQuickDemo = document.getElementById('btn-quick-demo');
    this.btnGoogle = document.getElementById('btn-google-login');
    this.btnGithub = document.getElementById('btn-github-login');
    this.linkForgot = document.getElementById('link-forgot-pwd');

    this.formsContainer = document.getElementById('auth-forms-container');
    this.sessionBox = document.getElementById('auth-session-box');
    this.sessionName = document.getElementById('session-user-name');
    this.sessionEmail = document.getElementById('session-user-email');
    this.sessionAvatar = document.getElementById('session-avatar-initial');
    this.btnSwitchAccount = document.getElementById('btn-switch-account');

    this.toast = document.getElementById('auth-toast');
    this.toastMsg = document.getElementById('toast-msg');
    this.toastIcon = document.getElementById('toast-icon');
  }

  initEvents() {
    // Tabs
    this.tabSignIn?.addEventListener('click', () => this.setMode('signin'));
    this.tabSignUp?.addEventListener('click', () => this.setMode('signup'));

    // Password Toggle
    this.btnTogglePwd?.addEventListener('click', () => {
      const isPwd = this.inputPassword.type === 'password';
      this.inputPassword.type = isPwd ? 'text' : 'password';
      this.btnTogglePwd.textContent = isPwd ? '🙈' : '👁';
    });

    // Forgot Password
    this.linkForgot?.addEventListener('click', (e) => {
      e.preventDefault();
      const email = this.inputEmail.value.trim();
      if (!email) {
        this.showToast('Please enter your email above first.', 'error');
        this.inputEmail.focus();
        return;
      }
      this.showToast(`Password reset link sent to ${email}`, 'success');
    });

    // Form Submit
    this.form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    // Quick Demo Login
    this.btnQuickDemo?.addEventListener('click', () => {
      this.performLogin({
        name: 'Alex Rivera',
        email: 'alex.rivera@designstudio.ai',
        role: 'Senior Interior Architect'
      });
    });

    // Social Logins
    this.btnGoogle?.addEventListener('click', () => {
      this.showToast('Connecting to Google...', 'success');
      setTimeout(() => {
        this.performLogin({
          name: 'Alex Rivera',
          email: 'alex.rivera@gmail.com',
          provider: 'google'
        });
      }, 700);
    });

    this.btnGithub?.addEventListener('click', () => {
      this.showToast('Connecting to GitHub...', 'success');
      setTimeout(() => {
        this.performLogin({
          name: 'Alex Rivera',
          email: 'alex@github.com',
          provider: 'github'
        });
      }, 700);
    });

    // Switch Account
    this.btnSwitchAccount?.addEventListener('click', () => {
      localStorage.removeItem('ai_interior_user');
      this.sessionBox.style.display = 'none';
      this.formsContainer.style.display = 'block';
      this.showToast('Signed out. Please sign in below.', 'success');
    });
  }

  setMode(mode) {
    this.mode = mode;
    if (mode === 'signin') {
      this.tabSignIn.classList.add('active');
      this.tabSignUp.classList.remove('active');
      this.title.textContent = 'Welcome Back';
      this.subtitle.textContent = 'Sign in to design, visualize, and customize interior spaces in real-time 3D.';
      this.fieldName.style.display = 'none';
      this.optionsRow.style.display = 'flex';
      this.submitLabel.textContent = 'Sign In to Studio';
      this.inputName.removeAttribute('required');
    } else {
      this.tabSignUp.classList.add('active');
      this.tabSignIn.classList.remove('active');
      this.title.textContent = 'Create Studio Account';
      this.subtitle.textContent = 'Join thousands of architects and homeowners designing spaces with AI.';
      this.fieldName.style.display = 'flex';
      this.optionsRow.style.display = 'none';
      this.submitLabel.textContent = 'Create Free Account';
      this.inputName.setAttribute('required', 'true');
    }
  }

  handleFormSubmit() {
    const email = this.inputEmail.value.trim();
    const password = this.inputPassword.value.trim();

    if (!email || !password) {
      this.showToast('Please enter both email and password.', 'error');
      return;
    }

    if (password.length < 6) {
      this.showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    let name = '';
    if (this.mode === 'signup') {
      name = this.inputName.value.trim() || email.split('@')[0];
    } else {
      name = email.split('@')[0].replace(/[._-]/g, ' ');
      name = name.charAt(0).toUpperCase() + name.slice(1);
    }

    this.performLogin({ name, email });
  }

  performLogin(userData) {
    const avatarInitial = (userData.name || userData.email || 'A').charAt(0).toUpperCase();
    const userSession = {
      name: userData.name || 'Studio Member',
      email: userData.email || 'user@designstudio.ai',
      avatarInitial: avatarInitial,
      signedInAt: new Date().toISOString(),
      provider: userData.provider || 'email'
    };

    try {
      localStorage.setItem('ai_interior_user', JSON.stringify(userSession));
    } catch (e) {
      console.warn('LocalStorage unavailable:', e);
    }

    this.showToast(`Welcome, ${userSession.name}! Launching Studio...`, 'success');

    setTimeout(() => {
      window.location.href = this.redirectUrl;
    }, 750);
  }

  checkExistingSession() {
    try {
      const stored = localStorage.getItem('ai_interior_user');
      if (stored) {
        const user = JSON.parse(stored);
        if (user && user.name) {
          this.sessionName.textContent = user.name;
          this.sessionEmail.textContent = user.email || 'Active Session';
          this.sessionAvatar.textContent = user.avatarInitial || user.name.charAt(0).toUpperCase();
          this.sessionBox.style.display = 'flex';
          this.formsContainer.style.display = 'none';
          this.title.textContent = 'Account Active';
          this.subtitle.textContent = `You are currently signed in as ${user.name}.`;
        }
      }
    } catch (e) {}
  }

  showToast(message, type = 'success') {
    if (!this.toast) return;
    this.toastMsg.textContent = message;
    this.toastIcon.textContent = type === 'success' ? '✨' : '⚠️';
    this.toast.className = `auth-toast show ${type}`;

    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toast.className = 'auth-toast';
    }, 3200);
  }

  // Lightweight ambient 3D geometric background
  init3DBackground() {
    const canvas = document.getElementById('auth-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(0, 0, 15);

      const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Architectural wireframe cubes
      const cubes = [];
      const cubeGeom = new THREE.BoxGeometry(2.4, 2.4, 2.4);
      const edgesGeom = new THREE.EdgesGeometry(cubeGeom);

      const colors = [0x6366f1, 0x8b5cf6, 0xec4899, 0x3b82f6];
      for (let i = 0; i < 9; i++) {
        const mat = new THREE.LineBasicMaterial({
          color: colors[i % colors.length],
          transparent: true,
          opacity: 0.28
        });
        const wireframe = new THREE.LineSegments(edgesGeom, mat);
        wireframe.position.set(
          (Math.random() - 0.5) * 26,
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 10 - 2
        );
        wireframe.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );
        wireframe.userData = {
          rotSpeedX: (Math.random() - 0.5) * 0.004,
          rotSpeedY: (Math.random() - 0.5) * 0.005,
          floatSpeed: (Math.random() * 0.002 + 0.001),
          baseY: wireframe.position.y
        };
        scene.add(wireframe);
        cubes.push(wireframe);
      }

      // Constellation points
      const pointCount = 120;
      const pointGeom = new THREE.BufferGeometry();
      const positions = new Float32Array(pointCount * 3);
      for (let i = 0; i < pointCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 35;
        positions[i + 1] = (Math.random() - 0.5) * 25;
        positions[i + 2] = (Math.random() - 0.5) * 15;
      }
      pointGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const pointMat = new THREE.PointsMaterial({
        color: 0x818cf8,
        size: 0.15,
        transparent: true,
        opacity: 0.45
      });
      const points = new THREE.Points(pointGeom, pointMat);
      scene.add(points);

      // Interactive mouse tilt
      let mouseX = 0, mouseY = 0;
      window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      });

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      let clock = 0;
      const animate = () => {
        requestAnimationFrame(animate);
        clock += 0.015;

        cubes.forEach((cube) => {
          cube.rotation.x += cube.userData.rotSpeedX;
          cube.rotation.y += cube.userData.rotSpeedY;
          cube.position.y = cube.userData.baseY + Math.sin(clock + cube.position.x) * 0.4;
        });

        points.rotation.y += 0.0006;

        // Gentle camera response to pointer
        camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.03;
        camera.position.y += (-mouseY * 0.8 - camera.position.y) * 0.03;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };
      animate();

    } catch (err) {
      console.warn('Ambient 3D background initialization skipped:', err);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new AuthManager();
});
