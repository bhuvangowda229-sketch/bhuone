/**
 * AI Interior Studio - User & Authentication Database
 */
var UserDB = (function() {
  var USERS_KEY = 'ai_interior_users_db';
  var SESSION_KEY = 'ai_interior_user';

  var ADMIN_EMAIL = 'bhuvan@gmail.com';
  var ADMIN_PASSWORDS = ['bhuvan@123', 'Bhuvan@123'];

  // Default Seed Accounts
  function getDefaultUsers() {
    return [
      {
        id: 'usr_admin',
        name: 'Bhuvan (Admin)',
        email: 'bhuvan@gmail.com',
        password: 'Bhuvan@123',
        role: 'admin',
        registeredAt: '2026-11-01T08:00:00.000Z',
        lastLoginAt: '2026-11-03T10:00:00.000Z',
        loginCount: 5,
        status: 'active'
      },
      {
        id: 'usr_sarah',
        name: 'Sarah Miller',
        email: 'sarah.miller@example.com',
        password: 'password123',
        role: 'user',
        registeredAt: '2026-11-02T10:30:00.000Z',
        lastLoginAt: '2026-11-03T09:15:00.000Z',
        loginCount: 3,
        status: 'active'
      }
    ];
  }

  function getUsers() {
    var users = [];
    try {
      var raw = localStorage.getItem(USERS_KEY);
      if (raw) {
        users = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('UserDB: LocalStorage read error', e);
    }

    if (!Array.isArray(users) || users.length === 0) {
      users = getDefaultUsers();
    }

    // Guarantee Admin account exists
    var adminFound = false;
    for (var i = 0; i < users.length; i++) {
      if (users[i].email && users[i].email.toLowerCase() === ADMIN_EMAIL) {
        users[i].role = 'admin';
        users[i].password = 'Bhuvan@123';
        adminFound = true;
        break;
      }
    }
    if (!adminFound) {
      users.unshift({
        id: 'usr_admin',
        name: 'Bhuvan (Admin)',
        email: ADMIN_EMAIL,
        password: 'Bhuvan@123',
        role: 'admin',
        registeredAt: '2026-11-01T08:00:00.000Z',
        lastLoginAt: new Date().toISOString(),
        loginCount: 1,
        status: 'active'
      });
    }

    // Guarantee default user exists
    var userFound = false;
    for (var j = 0; j < users.length; j++) {
      if (users[j].email && users[j].email.toLowerCase() === 'sarah.miller@example.com') {
        userFound = true;
        break;
      }
    }
    if (!userFound) {
      users.push({
        id: 'usr_sarah',
        name: 'Sarah Miller',
        email: 'sarah.miller@example.com',
        password: 'password123',
        role: 'user',
        registeredAt: '2026-11-02T10:30:00.000Z',
        lastLoginAt: '2026-11-03T09:15:00.000Z',
        loginCount: 3,
        status: 'active'
      });
    }

    saveUsers(users);
    return users;
  }

  function saveUsers(users) {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.warn('UserDB: LocalStorage save error', e);
    }
  }

  function getCurrentUser() {
    try {
      var raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {}
    return null;
  }

  function setCurrentUser(user) {
    try {
      var session = {
        id: user.id || 'usr_' + Date.now(),
        name: user.name || 'User',
        email: user.email || '',
        role: user.role || 'user',
        registeredAt: user.registeredAt || new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (e) {}
  }

  function signOut() {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {}
  }

  function authenticate(email, password) {
    var cleanEmail = (email || '').trim().toLowerCase();
    var cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      return { success: false, error: 'Please enter both email and password.' };
    }

    // 1. Check Admin Account
    if (cleanEmail === ADMIN_EMAIL) {
      var matchesAdmin = (cleanPassword === 'Bhuvan@123' || cleanPassword === 'bhuvan@123');
      if (matchesAdmin) {
        var adminUser = {
          id: 'usr_admin',
          name: 'Bhuvan (Admin)',
          email: ADMIN_EMAIL,
          role: 'admin',
          registeredAt: '2026-11-01T08:00:00.000Z',
          lastLoginAt: new Date().toISOString()
        };
        setCurrentUser(adminUser);
        return { success: true, user: adminUser };
      } else {
        return { success: false, error: 'Incorrect administrator password.' };
      }
    }

    // 2. Check User Accounts
    var users = getUsers();
    var user = null;
    for (var k = 0; k < users.length; k++) {
      if (users[k].email && users[k].email.toLowerCase() === cleanEmail) {
        user = users[k];
        break;
      }
    }

    if (!user) {
      // Auto-register new users so they can log in seamlessly
      if (cleanPassword.length < 4) {
        return { success: false, error: 'Password must be at least 4 characters.' };
      }
      var newUser = {
        id: 'usr_' + Date.now(),
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        password: cleanPassword,
        role: 'user',
        registeredAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        loginCount: 1,
        status: 'active'
      };
      users.unshift(newUser);
      saveUsers(users);
      setCurrentUser(newUser);
      return { success: true, user: newUser };
    }

    // Password validation (flexible case check)
    var passMatches = (user.password === cleanPassword || user.password.toLowerCase() === cleanPassword.toLowerCase());
    if (!passMatches) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    // Update login count and date
    user.lastLoginAt = new Date().toISOString();
    user.loginCount = (user.loginCount || 0) + 1;
    saveUsers(users);
    setCurrentUser(user);

    return { success: true, user: user };
  }

  function register(name, email, password, role) {
    var cleanEmail = (email || '').trim().toLowerCase();
    var cleanName = (name || '').trim() || cleanEmail.split('@')[0];
    var cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      return { success: false, error: 'Email and password are required.' };
    }
    if (cleanPassword.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters.' };
    }

    if (cleanEmail === ADMIN_EMAIL) {
      return { success: false, error: 'This email is reserved for the administrator.' };
    }

    var users = getUsers();
    for (var i = 0; i < users.length; i++) {
      if (users[i].email && users[i].email.toLowerCase() === cleanEmail) {
        return { success: false, error: 'An account with this email already exists. Please sign in.' };
      }
    }

    var newUser = {
      id: 'usr_' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
      role: 'user', // Public sign-up is always regular user
      registeredAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      loginCount: 1,
      status: 'active'
    };

    users.unshift(newUser);
    saveUsers(users);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  }

  function deleteUser(id) {
    var users = getUsers();
    var filtered = [];
    for (var i = 0; i < users.length; i++) {
      if (users[i].id === id && users[i].email.toLowerCase() === ADMIN_EMAIL) {
        return false; // Can't delete primary admin
      }
      if (users[i].id !== id) {
        filtered.push(users[i]);
      }
    }
    saveUsers(filtered);
    return true;
  }

  function formatDate(iso) {
    if (!iso) return 'N/A';
    try {
      var d = new Date(iso);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + 
             d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return iso;
    }
  }

  return {
    ADMIN_EMAIL: ADMIN_EMAIL,
    getUsers: getUsers,
    saveUsers: saveUsers,
    getCurrentUser: getCurrentUser,
    setCurrentUser: setCurrentUser,
    signOut: signOut,
    authenticate: authenticate,
    register: register,
    deleteUser: deleteUser,
    formatDate: formatDate
  };
})();

// Attach to window
if (typeof window !== 'undefined') {
  window.UserDB = UserDB;
}
