import { defineStore } from "pinia";
import { useRouter } from "vue-router";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null as User | null,
    token: null,
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;
      // TODO: implement login logic
      try {
        // TODO: implement login logic
      } catch (error) {
        // TODO: implement error handling
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      this.loading = false;
      this.error = null;
      localStorage.removeItem("token");
    },
  },
});
