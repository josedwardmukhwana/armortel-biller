<template>
  <section class="page-heading">
    <h1>Internet</h1>
    <p>Manage your internet connection and settings.</p>
  </section>

  <section class="status-panel">
    <div class="status-icon">
      <font-awesome-icon icon="globe" />
    </div>
    <div>
      <h2>Internet Status</h2>
      <span class="success-text">Connected</span>
    </div>
    <dl class="detail-list">
      <div><dt>Connection Type</dt><dd>PPPoE</dd></div>
      <div><dt>IP Address</dt><dd>41.203.25.68</dd></div>
      <div><dt>Subnet Mask</dt><dd>255.255.255.0</dd></div>
      <div><dt>Gateway</dt><dd>41.203.25.1</dd></div>
      <div><dt>DNS Servers</dt><dd>8.8.8.8, 8.8.4.4</dd></div>
      <div><dt>Uptime</dt><dd>2d 14h 32m</dd></div>
    </dl>
  </section>

  <section class="list-panel">
    <button class="setting-row" type="button">
      <font-awesome-icon icon="sliders" />
      <span><strong>Connection Settings</strong><small>Configure your internet connection</small></span>
      <font-awesome-icon icon="chevron-right" />
    </button>
    <button class="setting-row" type="button">
      <font-awesome-icon icon="server" />
      <span><strong>DNS Settings</strong><small>Manage DNS servers</small></span>
      <font-awesome-icon icon="chevron-right" />
    </button>
    <button class="setting-row" type="button">
      <font-awesome-icon icon="network-wired" />
      <span><strong>MAC Clone</strong><small>Clone your device MAC address</small></span>
      <font-awesome-icon icon="chevron-right" />
    </button>
    <button class="setting-row" type="button">
      <font-awesome-icon icon="gear" />
      <span><strong>Advanced Settings</strong><small>MTU, NAT, and more</small></span>
      <font-awesome-icon icon="chevron-right" />
    </button>
  </section>
</template>
