<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const auth = useAuthStore();

const email = ref("admin@armortel.local");
const password = ref("");
const loading = ref(false);
const error = ref("");

async function submitLogin() {
  loading.value = true;
  error.value = "";

  try {
    await auth.login(email.value, password.value);
    router.push("/dashboard");
  } catch {
    error.value = "Invalid account details or API is unavailable.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-brand" aria-label="Armortel Solutions">
      <img class="login-logo" src="/assets/armortel-logo.png" alt="Armortel Solutions" />
      <h1>ARMORTEL</h1>
      <p>SOLUTIONS</p>
      <span>Network Setup &amp; Configuration</span>
      <strong>ART-AX6000 PRO</strong>
    </section>

    <form class="login-card" @submit.prevent="submitLogin">
      <h2>Administrator Login</h2>

      <label for="email">Account</label>
      <input id="email" v-model="email" type="email" autocomplete="username" placeholder="Enter email" />

      <label for="password">Password</label>
      <input
        id="password"
        v-model="password"
        type="password"
        autocomplete="current-password"
        placeholder="Enter password"
      />

      <p v-if="error" class="login-error">{{ error }}</p>

      <button class="login-button" type="submit" :disabled="loading">
        {{ loading ? "Checking..." : "Login" }}
      </button>

      <small>Unauthorized access is prohibited</small>
    </form>
  </main>
</template>
