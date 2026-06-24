import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import BillingView from "../views/BillingView.vue";
import DashboardLayout from "../layouts/DashboardLayout.vue";
import DashboardView from "../views/DashboardView.vue";
import DevicesView from "../views/DevicesView.vue";
import InternetView from "../views/InternetView.vue";
import LoginView from "../views/LoginView.vue";
import SecurityView from "../views/SecurityView.vue";
import SettingsView from "../views/SettingsView.vue";
import UsersView from "../views/UsersView.vue";
import WirelessView from "../views/WirelessView.vue";
import { useAuthStore } from "../stores/auth";
import type { Role } from "../types/auth";

const routes: RouteRecordRaw[] = [
  { path: "/", redirect: "/dashboard" },
  { path: "/login", component: LoginView },
  {
    path: "/",
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "dashboard", component: DashboardView, meta: { roles: ["admin", "vendor", "user"] } },
      { path: "billing", component: BillingView, meta: { roles: ["admin", "vendor", "user"] } },
      { path: "internet", component: InternetView, meta: { roles: ["admin", "vendor"] } },
      { path: "wireless", component: WirelessView, meta: { roles: ["admin", "vendor"] } },
      { path: "devices", component: DevicesView, meta: { roles: ["admin", "vendor", "user"] } },
      { path: "security", component: SecurityView, meta: { roles: ["admin", "vendor"] } },
      { path: "settings", component: SettingsView, meta: { roles: ["admin"] } },
      { path: "users", component: UsersView, meta: { roles: ["admin"] } }
    ]
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return "/login";
  }

  const roles = to.meta.roles as Role[] | undefined;

  if (roles && auth.role && !roles.includes(auth.role)) {
    return "/dashboard";
  }

  return true;
});
