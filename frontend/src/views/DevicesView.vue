<template>
  <section class="page-heading">
    <h1>Devices</h1>
    <p>View and manage devices connected to your network.</p>
  </section>

  <section class="metric-grid three">
    <article class="metric-card compact"><span>Total Devices</span><strong>12</strong><small>Connected</small></article>
    <article class="metric-card compact"><span>Online Devices</span><strong>10</strong><small>Online</small></article>
    <article class="metric-card compact"><span>Offline Devices</span><strong>2</strong><small>Offline</small></article>
  </section>

  <section class="table-panel">
    <h2>Connected Devices</h2>
    <div class="device-row" v-for="device in devices" :key="device.ip">
      <font-awesome-icon :icon="device.icon" />
      <strong>{{ device.name }}</strong>
      <span>{{ device.ip }}</span>
      <em>{{ device.band }}</em>
      <span>{{ device.time }}</span>
      <font-awesome-icon icon="chevron-right" />
    </div>
  </section>
</template>

<script setup lang="ts">
const devices = [
  { icon: "wifi", name: "iPhone 13", ip: "192.168.1.101", band: "5 GHz", time: "2h 15m" },
  { icon: "laptop", name: "Laptop - Dell", ip: "192.168.1.102", band: "5 GHz", time: "1h 40m" },
  { icon: "desktop", name: "Smart TV - Samsung", ip: "192.168.1.103", band: "2.4 GHz", time: "3h 10m" },
  { icon: "desktop", name: "IP Camera", ip: "192.168.1.104", band: "2.4 GHz", time: "5h 5m" },
  { icon: "server", name: "Gaming Console", ip: "192.168.1.105", band: "5 GHz", time: "1h 20m" }
];
</script>
