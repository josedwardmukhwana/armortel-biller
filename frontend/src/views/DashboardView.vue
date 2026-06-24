<template>
  <section class="page-heading">
    <h1>Dashboard</h1>
    <p>Your network is running smoothly.</p>
  </section>

  <section class="network-map">
    <div class="map-node">
      <font-awesome-icon icon="globe" />
      <strong>Internet</strong>
      <span>Connected</span>
    </div>
    <div class="map-line"></div>
    <div class="router-core">
      <img src="/assets/armortel-logo.png" alt="Armortel router" />
      <strong>ARMORTEL ROUTER</strong>
      <span>Online</span>
    </div>
    <div class="map-line"></div>
    <div class="map-node">
      <font-awesome-icon icon="wifi" />
      <strong>Devices</strong>
      <span>12 connected</span>
    </div>
  </section>

  <section class="metric-grid">
    <article class="metric-card">
      <font-awesome-icon icon="desktop" />
      <span>Connected Devices</span>
      <strong>12</strong>
      <RouterLink to="/devices">View devices <font-awesome-icon icon="chevron-right" /></RouterLink>
    </article>

    <article class="metric-card">
      <font-awesome-icon icon="wifi" />
      <span>Wi-Fi Networks</span>
      <strong>2</strong>
      <RouterLink to="/wireless">Manage Wi-Fi <font-awesome-icon icon="chevron-right" /></RouterLink>
    </article>

    <article class="metric-card">
      <font-awesome-icon icon="shield-halved" />
      <span>Security</span>
      <strong>Protected</strong>
      <RouterLink to="/security">Security settings <font-awesome-icon icon="chevron-right" /></RouterLink>
    </article>
  </section>
</template>
