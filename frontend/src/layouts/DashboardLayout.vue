<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import type { Role } from "../types/auth";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

type NavItem = {
  label: string;
  to: string;
  icon: string;
  roles: Role[];
};

const navItems: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: "home", roles: ["admin", "vendor", "user"] },
  { label: "Billing", to: "/billing", icon: "file-invoice-dollar", roles: ["admin", "vendor", "user"] },
  { label: "Internet", to: "/internet", icon: "globe", roles: ["admin", "vendor"] },
  { label: "Wireless", to: "/wireless", icon: "wifi", roles: ["admin", "vendor"] },
  { label: "Devices", to: "/devices", icon: "desktop", roles: ["admin", "vendor", "user"] },
  { label: "Security", to: "/security", icon: "shield-halved", roles: ["admin", "vendor"] },
  { label: "Settings", to: "/settings", icon: "gear", roles: ["admin"] },
  { label: "Users", to: "/users", icon: "user-group", roles: ["admin"] }
];

const visibleNav = computed(() => navItems.filter((item) => auth.role && item.roles.includes(auth.role)));

function logout() {
  auth.logout();
  router.push("/login");
}
</script>

<template>
  <div class="admin-shell">
    <aside class="sidebar">
      <RouterLink class="brand" to="/dashboard" aria-label="Armortel dashboard">
        <img class="brand-mark" src="/assets/armortel-logo.png" alt="" />
        <span>
          <strong>ARMORTEL</strong>
          <small>SOLUTIONS</small>
        </span>
      </RouterLink>

      <nav class="sidebar-nav" aria-label="Main">
        <RouterLink
          v-for="item in visibleNav"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          :class="{ active: route.path === item.to }"
        >
          <font-awesome-icon :icon="item.icon" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <button class="logout-button" type="button" @click="logout">
        <font-awesome-icon icon="power-off" />
        <span>Logout</span>
      </button>
    </aside>

    <main class="workspace">
      <header class="topbar">
        <div>
          <span class="role-chip">{{ auth.role }}</span>
          <span class="user-name">{{ auth.user?.name }}</span>
        </div>
        <div class="topbar-actions">
          <button class="icon-button" type="button" aria-label="Notifications">
            <font-awesome-icon icon="bell" />
          </button>
          <button class="icon-button" type="button" aria-label="Profile">
            <font-awesome-icon icon="circle-user" />
          </button>
        </div>
      </header>

      <RouterView />

      <footer class="panel-footer">
        <span>Firmware: 1.0.0</span>
        <span>Uptime: 2d 14h 32m</span>
        <span>&copy; 2026 Armortel Solutions</span>
      </footer>
    </main>
  </div>
</template>
