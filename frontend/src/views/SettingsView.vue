<template>
  <section class="page-heading">
    <h1>Settings</h1>
    <p>Configure your router settings.</p>
  </section>

  <section class="list-panel">
    <button v-for="item in items" :key="item.title" class="setting-row" type="button">
      <font-awesome-icon :icon="item.icon" />
      <span><strong>{{ item.title }}</strong><small>{{ item.subtitle }}</small></span>
      <font-awesome-icon icon="chevron-right" />
    </button>
  </section>
</template>

<script setup lang="ts">
const items = [
  { icon: "gear", title: "System", subtitle: "Router information, time, and administration" },
  { icon: "network-wired", title: "LAN", subtitle: "Local network settings" },
  { icon: "rotate", title: "Update", subtitle: "Firmware update and maintenance" },
  { icon: "download", title: "Backup & Restore", subtitle: "Save or restore your settings" },
  { icon: "power-off", title: "Reboot", subtitle: "Restart your router" },
  { icon: "shield-halved", title: "Factory Reset", subtitle: "Reset router to default settings" }
];
</script>
