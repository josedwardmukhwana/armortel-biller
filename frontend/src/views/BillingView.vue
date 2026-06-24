<script setup lang="ts">
import { computed, ref } from "vue";
import { api } from "../services/api";
import { useAuthStore } from "../stores/auth";
import type { Role } from "../types/auth";

type Statement = {
  transactionId: string;
  amount: number;
  date: string;
  vendorId: string;
  userId: string;
};

type SubscriberProfile = {
  id: string;
  name: string;
  vendorId: string;
  dateSubscribed: string;
  status: "active" | "inactive";
};

const auth = useAuthStore();
const role = computed<Role>(() => auth.role ?? "user");
const activeTab = ref("statements");
const configMessage = ref("");
const profileMessage = ref("");
const paymentMessage = ref("");
const paymentError = ref("");

const paybillNumber = ref("400200");
const originalPaybillNumber = ref("400200");
const mpesaNumber = ref("");

const statements = ref<Statement[]>([
  { transactionId: "ARM-782911", amount: 2500, date: "2026-06-01", vendorId: "VEN-204", userId: "USR-9001" },
  { transactionId: "ARM-782912", amount: 1800, date: "2026-06-02", vendorId: "VEN-204", userId: "USR-9002" },
  { transactionId: "ARM-782913", amount: 3200, date: "2026-06-03", vendorId: "VEN-441", userId: "USR-9003" }
]);

const profiles = ref<SubscriberProfile[]>([
  { id: "USR-9001", name: "Grace Wanjiku", vendorId: "VEN-204", dateSubscribed: "2026-04-18", status: "active" },
  { id: "USR-9002", name: "Brian Otieno", vendorId: "VEN-204", dateSubscribed: "2026-05-03", status: "inactive" },
  { id: "USR-9003", name: "Amina Yusuf", vendorId: "VEN-441", dateSubscribed: "2026-05-24", status: "active" }
]);

const accountId = computed(() => (role.value === "user" ? auth.user?.id ?? "USR-9001" : "VEN-204"));

const tabs = computed(() => {
  if (role.value === "admin") {
    return [
      { id: "statements", label: "Statements" },
      { id: "configuration", label: "Configuration" },
      { id: "profiles", label: "Profiles" }
    ];
  }

  if (role.value === "vendor") {
    return [
      { id: "statements", label: "Statements" },
      { id: "profiles", label: "Profiles" },
      { id: "payment", label: "Payment" }
    ];
  }

  return [
    { id: "statements", label: "Statements" },
    { id: "payment", label: "Payment" }
  ];
});

const scopedStatements = computed(() => {
  if (role.value === "admin") {
    return statements.value;
  }

  if (role.value === "vendor") {
    return statements.value.filter((item) => item.vendorId === "VEN-204");
  }

  return statements.value.filter((item) => item.userId === "USR-9001");
});

const scopedProfiles = computed(() => {
  if (role.value === "admin") {
    return profiles.value;
  }

  return profiles.value.filter((item) => item.vendorId === "VEN-204");
});

async function updateConfiguration() {
  configMessage.value = "";

  if (paybillNumber.value === originalPaybillNumber.value) {
    configMessage.value = "No configuration changes detected.";
    return;
  }

  try {
    const { data } = await api.put<{ message: string; configuration: { mpesaPaybillNumber: string } }>(
      "/billing/configuration",
      { mpesaPaybillNumber: paybillNumber.value }
    );
    paybillNumber.value = data.configuration.mpesaPaybillNumber;
    originalPaybillNumber.value = data.configuration.mpesaPaybillNumber;
    configMessage.value = data.message;
  } catch {
    originalPaybillNumber.value = paybillNumber.value;
    configMessage.value = "Demo update saved locally. Connect the backend to persist this setting.";
  }
}

async function setProfileStatus(profile: SubscriberProfile, status: SubscriberProfile["status"]) {
  profileMessage.value = "";

  try {
    const { data } = await api.patch<{ message: string; profile: SubscriberProfile }>(`/billing/profiles/${profile.id}/status`, {
      status
    });
    profile.status = data.profile.status;
    profileMessage.value = data.message;
  } catch {
    profile.status = status;
    profileMessage.value = `Demo ${status === "active" ? "activation" : "block"} applied locally.`;
  }
}

async function submitPayment() {
  paymentError.value = "";
  paymentMessage.value = "";

  if (!mpesaNumber.value.trim()) {
    paymentError.value = "M-Pesa number is required.";
    return;
  }

  if (!/^07\d{8}$/.test(mpesaNumber.value)) {
    paymentError.value = "Enter a valid 10-digit M-Pesa number starting with 07.";
    return;
  }

  try {
    const { data } = await api.post<{ message: string }>("/billing/payments/stk-push", {
      accountId: accountId.value,
      mpesaNumber: mpesaNumber.value
    });
    paymentMessage.value = data.message;
  } catch {
    paymentMessage.value = "Demo STK push request accepted locally. Backend M-Pesa integration is pending.";
  }
}
</script>

<template>
  <section class="page-heading">
    <h1>Billing</h1>
    <p>Manage statements, profiles, configuration, and M-Pesa payments.</p>
  </section>

  <section class="billing-panel">
    <div class="billing-tabs" role="tablist" aria-label="Billing sections">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="activeTab === 'statements'" class="billing-section">
      <h2>Statements</h2>
      <div class="billing-table">
        <div class="billing-row heading">
          <span>Transaction ID</span>
          <span>Amount</span>
          <span>Date</span>
        </div>
        <div v-for="statement in scopedStatements" :key="statement.transactionId" class="billing-row">
          <strong>{{ statement.transactionId }}</strong>
          <span>KES {{ statement.amount.toLocaleString() }}</span>
          <span>{{ statement.date }}</span>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'configuration' && role === 'admin'" class="billing-section">
      <h2>Configuration</h2>
      <form class="billing-form-table" @submit.prevent="updateConfiguration">
        <label for="paybill">M-Pesa Paybill Number</label>
        <input id="paybill" v-model="paybillNumber" type="text" inputmode="numeric" />
        <button type="submit">Update</button>
      </form>
      <p v-if="configMessage" class="billing-message">{{ configMessage }}</p>
    </div>

    <div v-if="activeTab === 'profiles'" class="billing-section">
      <h2>Profiles</h2>
      <p v-if="profileMessage" class="billing-message">{{ profileMessage }}</p>
      <div class="billing-table profiles">
        <div class="billing-row heading">
          <span>User</span>
          <span>Date Subscribed</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        <div v-for="profile in scopedProfiles" :key="profile.id" class="billing-row">
          <strong>{{ profile.name }}</strong>
          <span>{{ profile.dateSubscribed }}</span>
          <em :class="profile.status">{{ profile.status }}</em>
          <span class="profile-actions">
            <button type="button" @click="setProfileStatus(profile, 'active')">Activate</button>
            <button type="button" class="ghost-danger" @click="setProfileStatus(profile, 'inactive')">Block</button>
          </span>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'payment'" class="billing-section payment-layout">
      <div>
        <h2>Payment</h2>
        <form class="billing-form-table payment-form" @submit.prevent="submitPayment">
          <label for="accountId">{{ role === "vendor" ? "Vendor ID" : "User ID" }}</label>
          <input id="accountId" :value="accountId" type="text" readonly />

          <label for="mpesaNumber">M-Pesa Number</label>
          <input id="mpesaNumber" v-model="mpesaNumber" type="text" inputmode="numeric" maxlength="10" placeholder="07xxxxxxxx" />

          <span></span>
          <button type="submit">Pay Now</button>
        </form>
        <p v-if="paymentError" class="billing-error">{{ paymentError }}</p>
        <p v-if="paymentMessage" class="billing-message">{{ paymentMessage }}</p>
      </div>

      <aside class="payment-info">
        <font-awesome-icon icon="money-bill-wave" />
        <strong>Manual Payments</strong>
        <p>For manual payments use the following:</p>
        <dl>
          <div>
            <dt>M-Pesa Paybill No.</dt>
            <dd>{{ paybillNumber }}</dd>
          </div>
          <div>
            <dt>Account No.</dt>
            <dd>{{ accountId }}</dd>
          </div>
        </dl>
      </aside>
    </div>
  </section>
</template>
