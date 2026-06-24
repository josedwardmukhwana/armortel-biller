import { defineStore } from "pinia";
import { api } from "../services/api";
import type { AuthUser, Role } from "../types/auth";

type AuthState = {
  token: string | null;
  user: AuthUser | null;
};

const storedUser = localStorage.getItem("armortel.user");
const demoAuthEnabled = import.meta.env.VITE_DEMO_AUTH === "true";

const demoUsers: Record<string, AuthUser & { password: string }> = {
  "admin@armortel.local": {
    id: "demo-admin",
    name: "Armortel Admin",
    email: "admin@armortel.local",
    role: "admin",
    password: "password123"
  },
  "vendor@armortel.local": {
    id: "demo-vendor",
    name: "Vendor Desk",
    email: "vendor@armortel.local",
    role: "vendor",
    password: "password123"
  },
  "user@armortel.local": {
    id: "demo-user",
    name: "Network User",
    email: "user@armortel.local",
    role: "user",
    password: "password123"
  }
};

function toAuthUser(user: AuthUser & { password: string }): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as Role
  };
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    token: localStorage.getItem("armortel.token"),
    user: storedUser ? JSON.parse(storedUser) : null
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token && state.user),
    role: (state) => state.user?.role
  },
  actions: {
    async login(email: string, password: string) {
      try {
        const { data } = await api.post<{ token: string; user: AuthUser }>("/auth/login", { email, password });

        this.token = data.token;
        this.user = data.user;
        localStorage.setItem("armortel.token", data.token);
        localStorage.setItem("armortel.user", JSON.stringify(data.user));
      } catch (error) {
        const demoUser = demoUsers[email.toLowerCase()];

        if (!demoAuthEnabled || !demoUser || demoUser.password !== password) {
          throw error;
        }

        const user = toAuthUser(demoUser);
        const token = `demo.${user.role}.${Date.now()}`;

        this.token = token;
        this.user = user;
        localStorage.setItem("armortel.token", token);
        localStorage.setItem("armortel.user", JSON.stringify(user));
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("armortel.token");
      localStorage.removeItem("armortel.user");
    }
  }
});
