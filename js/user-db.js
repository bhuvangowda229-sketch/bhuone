/**
 * AI Interior Studio - User Database & Authentication Service
 * Manages persistent user registry, registration dates, login tracking & session storage
 */

class UserDB {
  static STORAGE_KEY = 'ai_interior_users_db';
  static SESSION_KEY = 'ai_interior_user';

  // Retrieve all users from localStorage, automatically seeding initial accounts if empty
  static getUsers() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        const users = JSON.parse(raw);
        if (Array.isArray(users) && users.length > 0) {
          return users;
        }
      }
    } catch (e) {
      console.warn('UserDB: Failed to read from localStorage:', e);
    }
    return this.seedDefaultUsers();
  }

  // Save the full user list to localStorage
  static saveUsers(users) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.warn('UserDB: Failed to save to localStorage:', e);
    }
  }

  // Pre-seed default administrator and demo user accounts with realistic creation dates
  static seedDefaultUsers() {
    const defaults = [
      {
        id: 'usr_admin',
        name: 'Studio Administrator',
        email: 'admin@designstudio.ai',
        password: 'admin',
        role: 'admin',
        avatarInitial: 'A',
        registeredAt: '2026-10-15T08:30:00.000Z',
        lastLoginAt: '2026-11-03T10:00:00.000Z',
        loginCount: 28,
        status: 'active'
      },
      {
        id: 'usr_alex',
        name: 'Alex Rivera',
        email: 'alex.rivera@designstudio.ai',
        password: 'password123',
        role: 'user',
        avatarInitial: 'A',
        registeredAt: '2026-10-24T14:15:00.000Z',
        lastLoginAt: '2026-11-02T19:20:00.000Z',
        loginCount: 12,
        status: 'active'
      },
      {
        id: 'usr_sophia',
        name: 'Sophia Chen',
        email: 'sophia.chen@archdesign.org',
        password: 'password123',
        role: 'user',
        avatarInitial: 'S',
        registeredAt: '2026-10-30T11:45:00.000Z',
        lastLoginAt: '2026-11-01T16:10:00.000Z',
        loginCount: 5,
        status: 'active'
      }
    ];
    this.saveUsers(defaults);
    return defaults;
  }

  // Find user by email (case-insensitive)
  static findUserByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    const users = this.getUsers();
    return users.find(u => u.email.toLowerCase() === cleanEmail) || null;
  }

  // Register a new user and store their registration date
  static registerUser({ name, email, password, role = 'user' }) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name ? name.trim() : cleanEmail.split('@')[0];

    if (!cleanEmail || !password) {
      return { success: false, error: 'Email and password are required.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const existing = this.findUserByEmail(cleanEmail);
    if (existing) {
      return { success: false, error: 'An account with this email already exists. Please sign in.' };
    }

    const nowIso = new Date().toISOString();
    const initial = cleanName.charAt(0).toUpperCase() || 'U';

    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: cleanName,
      email: cleanEmail,
      password: password,
      role: role || (cleanEmail.includes('admin') ? 'admin' : 'user'),
      avatarInitial: initial,
      registeredAt: nowIso, // Exact date and time of user registration
      lastLoginAt: nowIso,
      loginCount: 1,
      status: 'active'
    };

    const users = this.getUsers();
    users.unshift(newUser); // Add to beginning of list
    this.saveUsers(users);

    // Automatically set active session
    this.setCurrentUser(newUser);

    return { success: true, user: newUser };
  }

  // Authenticate user with email and password
  static authenticateUser(email, password) {
    const cleanEmail = email.trim().toLowerCase();
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === cleanEmail);

    if (userIndex === -1) {
      return { success: false, error: 'No account found with this email. Please sign up.' };
    }

    const user = users[userIndex];
    if (user.password && user.password !== password.trim()) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    // Update login count and timestamp
    const nowIso = new Date().toISOString();
    user.lastLoginAt = nowIso;
    user.loginCount = (user.loginCount || 0) + 1;
    users[userIndex] = user;
    this.saveUsers(users);

    // Store active session
    this.setCurrentUser(user);

    return { success: true, user };
  }

  // Get active user session
  static getCurrentUser() {
    try {
      const raw = localStorage.getItem(this.SESSION_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('UserDB: Failed to read session:', e);
    }
    return null;
  }

  // Set active user session
  static setCurrentUser(user) {
    try {
      const sessionData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        avatarInitial: user.avatarInitial || user.name.charAt(0).toUpperCase(),
        registeredAt: user.registeredAt,
        lastLoginAt: user.lastLoginAt,
        signedInAt: new Date().toISOString()
      };
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
    } catch (e) {
      console.warn('UserDB: Failed to set session:', e);
    }
  }

  // Sign out
  static signOut() {
    try {
      localStorage.removeItem(this.SESSION_KEY);
    } catch (e) {}
  }

  // Admin: Delete user by ID
  static deleteUser(userId) {
    const users = this.getUsers();
    const filtered = users.filter(u => u.id !== userId);
    this.saveUsers(filtered);

    // If currently signed in user was deleted, sign out
    const current = this.getCurrentUser();
    if (current && current.id === userId) {
      this.signOut();
    }
    return true;
  }

  // Admin: Toggle or set user role
  static updateUserRole(userId, newRole) {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.role = newRole;
      this.saveUsers(users);

      const current = this.getCurrentUser();
      if (current && current.id === userId) {
        current.role = newRole;
        this.setCurrentUser(current);
      }
      return true;
    }
    return false;
  }

  // Admin: Add a user directly
  static adminAddUser({ name, email, password, role = 'user' }) {
    return this.registerUser({ name, email, password, role });
  }

  // Format ISO timestamp to human-friendly display date and time
  static formatDate(isoString) {
    if (!isoString) return 'Never';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return isoString;
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  }

  // Format relative time (e.g. "Just now", "2 hours ago", "3 days ago")
  static formatRelativeTime(isoString) {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMin / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMin < 1) return 'Just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 30) return `${diffDays}d ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
      return '';
    }
  }

  // Generate CSV data for export and prompt download
  static exportUsersCSV() {
    const users = this.getUsers();
    const headers = ['ID', 'Full Name', 'Email', 'Role', 'Status', 'Registered Date & Time', 'Last Login Date & Time', 'Total Logins'];
    const rows = users.map(u => [
      `"${u.id || ''}"`,
      `"${(u.name || '').replace(/"/g, '""')}"`,
      `"${(u.email || '').replace(/"/g, '""')}"`,
      `"${u.role || 'user'}"`,
      `"${u.status || 'active'}"`,
      `"${this.formatDate(u.registeredAt)}"`,
      `"${this.formatDate(u.lastLoginAt)}"`,
      u.loginCount || 1
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    try {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `ai_interior_users_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.warn('Could not auto-trigger CSV download:', e);
    }
    return csvContent;
  }
}

// Global & Module universal export
if (typeof window !== 'undefined') {
  window.UserDB = UserDB;
}
try {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UserDB };
  }
} catch (e) {}
