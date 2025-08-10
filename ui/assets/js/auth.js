import { API } from './api.js';

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.isBootstrapped = false;
  }

  async bootstrap() {
    try {
      const me = await API.me();
      this.currentUser = me?.user || me || null;
    } catch (_) {
      this.currentUser = null;
    } finally {
      this.isBootstrapped = true;
    }
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  async login(username, password) {
    await API.login(username, password);
    await this.bootstrap();
    return this.currentUser;
  }

  async logout() {
    try { await API.logout(); } catch (_) {}
    this.currentUser = null;
  }
}

export const Auth = new AuthManager();