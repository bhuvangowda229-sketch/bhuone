// AI Interior Studio - Authentication Controller & Background 3D Engine
(function() {
  'use strict';

  // 1. DEFAULT SEED ACCOUNTS & SESSION MANAGER
  const DEFAULT_ACCOUNTS = [
    {
      name: 'Alex Rivera',
      email: 'demo@ai-interior.com',
      password: 'password123',
      style: 'modern',
      avatarInitial: 'A'
    }
  ];

  function getAccounts() {
    try {
      const stored = localStorage.getItem('ai_interior_accounts');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem('ai_interior_accounts', JSON.stringify(DEFAULT_ACCOUNTS));
    return DEFAULT_ACCOUNTS;
  }

  function saveAccounts(accounts) {
    localStorage.setItem('ai_interior_accounts', JSON.stringify(accounts));
  }

  function getCurrentUser() {
    try {
      const stored = localStorage.getItem('ai_interior_user');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  function setCurrentUser(user) {
    if (user) {
      localStorage.setItem('ai_interior_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ai_interior_user');
    }
  }

  function getRedirectUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('redirect') || 'studio.html';
  }

  // 2. ALERT & FEEDBACK HELPERS
  function showAlert(msg, isError = true) {
    const alertEl = document.getElementById('auth-alert');
    if (!alertEl) return;
    alertEl.className = `auth-alert ${isError ? 'error' : 'success'}`;
    alertEl.innerHTML = `<span>${isError ? '⚠️' : '✅'}</span> <span>${msg}</span>`;
    alertEl.style.display = 'flex';
  }

  function clearAlert() {
    const alertEl = document.getElementById('auth-alert');
    if (alertEl) alertEl.style.display = 'none';
  }

  // 3. AMBIENT 3D BACKGROUND ENGINE
  function initAmbient3D() {
    const canvas = document.getElementById('auth-bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(0, 0, 7);

      const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Ambient and directional lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambientLight);

      const light1 = new THREE.PointLight(0x6366f1, 2.5, 20);
      light1.position.set(4, 5, 3);
      scene.add(light1);

      const light2 = new THREE.PointLight(0xec4899, 2.0, 20);
      light2.position.set(-4, -4, 2);
      scene.add(light2);

      // Floating abstract architectural shapes
      const shapesGroup = new THREE.Group();
      scene.add(shapesGroup);

      // Glassy / metallic modern torus
      const torusMat = new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.6
      });
      const torus = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.15, 16, 100), torusMat);
      torus.position.set(-2.5, 0.5, -2);
      shapesGroup.add(torus);

      // Wireframe modern architectural cube
      const cubeMat = new THREE.MeshStandardMaterial({
        color: 0xec4899,
        wireframe: true,
        wireframeLinewidth: 1.5,
        transparent: true,
        opacity: 0.35
      });
      const cube = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.6, 2.6), cubeMat);
      cube.position.set(3.2, -0.8, -1.5);
      shapesGroup.add(cube);

      // Modern sphere
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.45
      });
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), sphereMat);
      sphere.position.set(-3.5, -2.0, 0);
      shapesGroup.add(sphere);

      // Floating dust particles
      const particlesCount = 80;
      const partGeo = new THREE.BufferGeometry();
      const partPositions = new Float32Array(particlesCount * 3);
      for (let i = 0; i < particlesCount * 3; i += 3) {
        partPositions[i] = (Math.random() - 0.5) * 16;
        partPositions[i + 1] = (Math.random() - 0.5) * 12;
        partPositions[i + 2] = (Math.random() - 0.5) * 10;
      }
      partGeo.setAttribute('position', new THREE.BufferAttribute(partPositions, 3));
      const partMat = new THREE.PointsMaterial({
        color: 0xa5b4fc,
        size: 0.05,
        transparent: true,
        opacity: 0.6
      });
      const particleSystem = new THREE.Points(partGeo, partMat);
      scene.add(particleSystem);

      // Gentle mouse tracking
      let mouseX = 0, mouseY = 0;
      window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 0.8;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 0.8;
      });

      // Window resize
      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      // Animation loop
      function animate() {
        requestAnimationFrame(animate);
        torus.rotation.x += 0.004;
        torus.rotation.y += 0.007;
        cube.rotation.x -= 0.005;
        cube.rotation.y -= 0.006;
        sphere.rotation.y += 0.005;

        particleSystem.rotation.y += 0.001;

        camera.position.x += (mouseX - camera.position.x) * 0.03;
        camera.position.y += (-mouseY - camera.position.y) * 0.03;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      }
      animate();
    } catch (err) {
      console.warn('WebGL background initialization skipped:', err);
    }
  }

  // 4. MAIN CONTROLLER
  function initAuth() {
    const tabSignIn = document.getElementById('tab-btn-signin');
    const tabSignUp = document.getElementById('tab-btn-signup');
    const formSignIn = document.getElementById('form-signin');
    const formSignUp = document.getElementById('form-signup');
    const authSubtitle = document.getElementById('auth-subtitle');
    const activeSessionBox = document.getElementById('active-session-box');
    const authFormsContainer = document.getElementById('auth-forms-container');

    // Check if user is already signed in
    const currentUser = getCurrentUser();
    if (currentUser && activeSessionBox) {
      activeSessionBox.style.display = 'flex';
      authFormsContainer.style.display = 'none';
      if (document.querySelector('.auth-tabs')) {
        document.querySelector('.auth-tabs').style.display = 'none';
      }

      document.getElementById('current-user-avatar').textContent = currentUser.avatarInitial || currentUser.name.charAt(0).toUpperCase();
      document.getElementById('current-user-name').textContent = currentUser.name;
      document.getElementById('current-user-email').textContent = currentUser.email;

      document.getElementById('btn-continue-session').addEventListener('click', () => {
        window.location.href = getRedirectUrl();
      });

      document.getElementById('btn-switch-account').addEventListener('click', () => {
        setCurrentUser(null);
        window.location.reload();
      });
      return;
    }

    // Tab Switching
    function setTab(mode) {
      clearAlert();
      if (mode === 'signin') {
        tabSignIn.classList.add('active');
        tabSignUp.classList.remove('active');
        formSignIn.classList.add('active');
        formSignUp.classList.remove('active');
        authSubtitle.textContent = 'Welcome back! Sign in to access your saved rooms and AI designs.';
      } else {
        tabSignUp.classList.add('active');
        tabSignIn.classList.remove('active');
        formSignUp.classList.add('active');
        formSignIn.classList.remove('active');
        authSubtitle.textContent = 'Create an account to save custom layouts and export blueprints.';
      }
    }

    tabSignIn?.addEventListener('click', () => setTab('signin'));
    tabSignUp?.addEventListener('click', () => setTab('signup'));

    // Password Visibility Toggles
    document.querySelectorAll('.toggle-pwd').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const input = document.getElementById(targetId);
        if (input) {
          if (input.type === 'password') {
            input.type = 'text';
            btn.textContent = '🙈';
          } else {
            input.type = 'password';
            btn.textContent = '👁️';
          }
        }
      });
    });

    // Password Strength Meter for Signup
    const signupPwd = document.getElementById('signup-password');
    const strengthFill = document.getElementById('pwd-strength-fill');
    const strengthText = document.getElementById('pwd-strength-text');

    if (signupPwd && strengthFill && strengthText) {
      signupPwd.addEventListener('input', (e) => {
        const val = e.target.value;
        if (!val) {
          strengthFill.style.width = '0%';
          strengthText.textContent = '';
          return;
        }

        let score = 0;
        if (val.length >= 6) score++;
        if (val.length >= 10) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;

        if (score <= 2) {
          strengthFill.style.width = '33%';
          strengthFill.style.background = '#f43f5e';
          strengthText.textContent = 'Password strength: Weak';
          strengthText.style.color = '#f43f5e';
        } else if (score <= 3) {
          strengthFill.style.width = '66%';
          strengthFill.style.background = '#f59e0b';
          strengthText.textContent = 'Password strength: Fair';
          strengthText.style.color = '#f59e0b';
        } else {
          strengthFill.style.width = '100%';
          strengthFill.style.background = '#10b981';
          strengthText.textContent = 'Password strength: Strong!';
          strengthText.style.color = '#10b981';
        }
      });
    }

    // Sign In Submission
    formSignIn?.addEventListener('submit', (e) => {
      e.preventDefault();
      clearAlert();

      const email = document.getElementById('signin-email').value.trim().toLowerCase();
      const password = document.getElementById('signin-password').value;

      if (!email || !password) {
        showAlert('Please enter both your email and password.');
        return;
      }

      const accounts = getAccounts();
      const user = accounts.find(a => a.email.toLowerCase() === email && a.password === password);

      if (user) {
        showAlert(`Welcome back, ${user.name}! Launching studio...`, false);
        setCurrentUser(user);
        setTimeout(() => {
          window.location.href = getRedirectUrl();
        }, 600);
      } else {
        showAlert('Invalid email or password. Use demo@ai-interior.com / password123 or try Instant Demo.');
      }
    });

    // Sign Up Submission
    formSignUp?.addEventListener('submit', (e) => {
      e.preventDefault();
      clearAlert();

      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim().toLowerCase();
      const password = document.getElementById('signup-password').value;
      const style = document.getElementById('signup-style')?.value || 'modern';

      if (!name || !email || !password) {
        showAlert('Please fill in all required fields.');
        return;
      }

      if (password.length < 6) {
        showAlert('Password must be at least 6 characters.');
        return;
      }

      const accounts = getAccounts();
      if (accounts.some(a => a.email.toLowerCase() === email)) {
        showAlert('An account with this email already exists. Please sign in instead.');
        return;
      }

      const newUser = {
        name: name,
        email: email,
        password: password,
        style: style,
        avatarInitial: name.charAt(0).toUpperCase()
      };

      accounts.push(newUser);
      saveAccounts(accounts);
      setCurrentUser(newUser);

      showAlert(`Account created successfully! Welcome, ${name}!`, false);
      setTimeout(() => {
        window.location.href = getRedirectUrl();
      }, 700);
    });

    // Instant Guest Demo Login Buttons
    document.querySelectorAll('.btn-guest-demo').forEach(btn => {
      btn.addEventListener('click', () => {
        clearAlert();
        const demoUser = {
          name: 'Alex Rivera',
          email: 'demo@ai-interior.com',
          style: 'modern',
          avatarInitial: 'A',
          isGuestDemo: true
        };
        setCurrentUser(demoUser);
        showAlert('Signing in as Demo Guest Designer...', false);
        setTimeout(() => {
          window.location.href = getRedirectUrl();
        }, 500);
      });
    });

    // Social Login Simulation
    document.querySelectorAll('.btn-social').forEach(btn => {
      btn.addEventListener('click', () => {
        const provider = btn.dataset.provider || 'Social';
        const socialUser = {
          name: `${provider} User`,
          email: `user@${provider.toLowerCase()}.com`,
          style: 'modern',
          avatarInitial: provider.charAt(0).toUpperCase(),
          provider: provider
        };
        setCurrentUser(socialUser);
        showAlert(`Signed in via ${provider}! Redirecting...`, false);
        setTimeout(() => {
          window.location.href = getRedirectUrl();
        }, 600);
      });
    });

    // Forgot Password Modal
    const forgotModal = document.getElementById('forgot-modal');
    document.getElementById('link-forgot-pwd')?.addEventListener('click', (e) => {
      e.preventDefault();
      forgotModal?.classList.add('open');
    });

    document.getElementById('btn-close-forgot')?.addEventListener('click', () => {
      forgotModal?.classList.remove('open');
    });

    document.getElementById('form-forgot')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('forgot-email')?.value.trim();
      if (email) {
        alert(`A password reset link has been simulated and sent to ${email}!`);
        forgotModal?.classList.remove('open');
      }
    });
  }

  // Auto-run on DOM ready
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => {
      initAmbient3D();
      initAuth();
    });
  } else {
    initAmbient3D();
    initAuth();
  }

})();
