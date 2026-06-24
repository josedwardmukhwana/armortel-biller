<template>
  <section class="page-heading">
    <h1>Wireless (Wi-Fi)</h1>
    <p>Manage your Wi-Fi networks and settings.</p>
  </section>

  <section class="wifi-list">
    <article class="wifi-card">
      <header>
        <font-awesome-icon icon="wifi" />
        <strong>Armortel_5G</strong>
        <span>5 GHz</span>
        <div class="form-check form-switch ms-auto">
          <input class="form-check-input" type="checkbox" role="switch" checked aria-label="Toggle 5G network" />
        </div>
      </header>
      <dl class="detail-list compact">
        <div><dt>Status</dt><dd>Enabled</dd></div>
        <div><dt>Network Name (SSID)</dt><dd>Armortel_5G</dd></div>
        <div><dt>Security</dt><dd>WPA2/WPA3-Personal</dd></div>
        <div><dt>Password</dt><dd>********</dd></div>
        <div><dt>Connected Devices</dt><dd>8</dd></div>
      </dl>
    </article>

    <article class="wifi-card">
      <header>
        <font-awesome-icon icon="wifi" />
        <strong>Armortel_2.4G</strong>
        <span>2.4 GHz</span>
        <div class="form-check form-switch ms-auto">
          <input class="form-check-input" type="checkbox" role="switch" checked aria-label="Toggle 2.4G network" />
        </div>
      </header>
      <dl class="detail-list compact">
        <div><dt>Status</dt><dd>Enabled</dd></div>
        <div><dt>Network Name (SSID)</dt><dd>Armortel_2.4G</dd></div>
        <div><dt>Security</dt><dd>WPA2-Personal</dd></div>
        <div><dt>Password</dt><dd>********</dd></div>
        <div><dt>Connected Devices</dt><dd>4</dd></div>
      </dl>
    </article>

    <button class="setting-row" type="button">
      <font-awesome-icon icon="unlock-keyhole" />
      <span><strong>Guest Network</strong><small>Create and manage guest Wi-Fi</small></span>
      <font-awesome-icon icon="chevron-right" />
    </button>
  </section>
</template>
