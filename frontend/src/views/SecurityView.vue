<template>
  <section class="page-heading">
    <h1>Security</h1>
    <p>Keep your network safe and secure.</p>
  </section>

  <section class="list-panel">
    <button v-for="item in items" :key="item.title" class="setting-row" type="button">
      <font-awesome-icon :icon="item.icon" />
      <span><strong>{{ item.title }}</strong><small>{{ item.subtitle }}</small></span>
      <em v-if="item.enabled">Enabled</em>
      <font-awesome-icon icon="chevron-right" />
    </button>
  </section>
</template>

<script setup lang="ts">
const items = [
  { icon: "shield-halved", title: "Firewall", subtitle: "Protect your network from unwanted access", enabled: true },
  { icon: "user-group", title: "Parental Controls", subtitle: "Manage internet access for your family" },
  { icon: "lock", title: "Access Control", subtitle: "Allow or block devices from your network" },
  { icon: "network-wired", title: "MAC Filtering", subtitle: "Allow or block devices by MAC address" },
  { icon: "shield-halved", title: "Intrusion Protection", subtitle: "Protect your network from attacks", enabled: true },
  { icon: "server", title: "Security Log", subtitle: "View security events and activity" }
];
</script>
