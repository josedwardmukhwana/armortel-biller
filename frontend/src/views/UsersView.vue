<script setup lang="ts">
import type { Role } from "../types/auth";

const roleCards: { role: Role; description: string; access: string }[] = [
  { role: "admin", description: "Full system administration", access: "Users, settings, security, and network control" },
  { role: "vendor", description: "Operational network management", access: "Dashboard, internet, wireless, devices, and security" },
  { role: "user", description: "Limited account visibility", access: "Dashboard and connected devices" }
];
</script>

<template>
  <section class="page-heading">
    <h1>Users</h1>
    <p>Manage Armortel account access and role permissions.</p>
  </section>

  <section class="role-grid">
    <article v-for="item in roleCards" :key="item.role" class="role-card">
      <font-awesome-icon icon="user-group" />
      <span>{{ item.role }}</span>
      <strong>{{ item.description }}</strong>
      <p>{{ item.access }}</p>
    </article>
  </section>

  <section class="table-panel">
    <h2>Accounts</h2>
    <div class="device-row">
      <font-awesome-icon icon="circle-user" />
      <strong>Armortel Admin</strong>
      <span>admin@armortel.local</span>
      <em>admin</em>
      <span>Active</span>
    </div>
    <div class="device-row">
      <font-awesome-icon icon="circle-user" />
      <strong>Vendor Desk</strong>
      <span>vendor@armortel.local</span>
      <em>vendor</em>
      <span>Active</span>
    </div>
    <div class="device-row">
      <font-awesome-icon icon="circle-user" />
      <strong>Network User</strong>
      <span>user@armortel.local</span>
      <em>user</em>
      <span>Active</span>
    </div>
  </section>
</template>
