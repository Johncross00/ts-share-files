import { defineStore } from 'pinia';

interface User {
  id: string;
  name: string;
}

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: (JSON.parse(localStorage.getItem('user') as string) as User | null) || null,
  }),
  actions: {
    login(username: string) {
      this.user = {
        id: 'user123',
        name: username,
      };
      localStorage.setItem('user', JSON.stringify(this.user));
    },
    logout() {
      this.user = null;
      localStorage.removeItem('user');
    },
  },
  getters: {
    isAuthenticated(state): boolean {
      return !!state.user;
    },
  },
});
