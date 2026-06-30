<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
  errorMessage?: string;
  loading?: boolean;
}>();

defineEmits<{
  submit: [];
}>();
</script>

<template>
  <div class="auth-wrapper">
    <div class="cloud cloud-1"></div>
    <div class="cloud cloud-2"></div>
    <div class="cloud cloud-3"></div>
    <div class="cloud cloud-4"></div>
    <div class="cloud cloud-5"></div>
    <div class="cloud cloud-6"></div>

    <div class="logo">
      <svg width="38" height="38" viewBox="0 0 64 64" fill="none">
        <path
          d="M32 8 C34 8 35 10 35 13 L35 26 L52 34 C54 35 54 38 52 39 L35 36 L35 46 L41 51 C42 52 42 54 40 54 L32 51 L24 54 C22 54 22 52 23 51 L29 46 L29 36 L12 39 C10 38 10 35 12 34 L29 26 L29 13 C29 10 30 8 32 8 Z"
          fill="#FFFFFF"
          stroke="#2B6CB0"
          stroke-width="2.5"
          stroke-linejoin="round"
          stroke-linecap="round"
        />
        <circle cx="32" cy="16" r="2" fill="#F0923B" />
      </svg>
      <span class="logo-text">wander<span>log</span></span>
    </div>

    <form class="auth-card" @submit.prevent="$emit('submit')">
      <h1>{{ title }}</h1>
      <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      <slot />
      <button type="submit" class="submit-btn" :disabled="loading">
        {{ loading ? "Loading..." : title }}
      </button>
      <p class="switch-link">
        <slot name="footer" />
      </p>
    </form>
  </div>
</template>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.cloud {
  position: absolute;
  width: 120px;
  height: 70px;
  opacity: 0.6;
}

.cloud::before,
.cloud::after {
  content: "";
  position: absolute;
  background: var(--color-border);
  border-radius: 50%;
}

.cloud-1 {
  top: 8%;
  left: 10%;
}
.cloud-1::before {
  width: 60px;
  height: 60px;
  top: 5px;
  left: 0;
}
.cloud-1::after {
  width: 80px;
  height: 50px;
  top: 15px;
  left: 35px;
}

.cloud-2 {
  top: 15%;
  right: 8%;
  width: 80px;
}
.cloud-2::before {
  width: 40px;
  height: 40px;
  top: 8px;
  left: 0;
}
.cloud-2::after {
  width: 50px;
  height: 32px;
  top: 18px;
  left: 25px;
}

.cloud-3 {
  bottom: 10%;
  left: 6%;
  width: 90px;
}
.cloud-3::before {
  width: 45px;
  height: 45px;
  top: 8px;
  left: 0;
}
.cloud-3::after {
  width: 60px;
  height: 38px;
  top: 18px;
  left: 28px;
}

.cloud-4 {
  top: 35%;
  left: 18%;
  width: 60px;
}
.cloud-4::before { width: 32px; height: 32px; top: 6px; left: 0; }
.cloud-4::after { width: 40px; height: 26px; top: 13px; left: 20px; }

.cloud-5 {
  top: 60%;
  right: 14%;
  width: 100px;
}
.cloud-5::before { width: 50px; height: 50px; top: 6px; left: 0; }
.cloud-5::after { width: 65px; height: 42px; top: 14px; left: 30px; }

.cloud-6 {
  bottom: 22%;
  right: 22%;
  width: 70px;
}
.cloud-6::before { width: 35px; height: 35px; top: 6px; left: 0; }
.cloud-6::after { width: 45px; height: 28px; top: 14px; left: 22px; }

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;
}

.logo-text {
  font-size: 22px;
  font-weight: 600;
  color: var(--color-blue);
  letter-spacing: -0.5px;
}

.logo-text span {
  color: var(--color-orange);
}

.auth-card {
  width: 100%;
  max-width: 380px;
  background: var(--color-surface);
  border: 2px solid var(--color-blue);
  border-radius: var(--radius-lg);
  padding: 2.25rem 2rem;
  position: relative;
  z-index: 2;
}

h1 {
  font-size: 22px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 6px;
}

.subtitle {
  font-size: 13px;
  color: var(--color-text-muted);
  text-align: center;
  margin-bottom: 1.75rem;
}

.error {
  background: var(--color-danger-bg);
  border: 2px solid rgba(224, 86, 63, 0.25);
  color: var(--color-danger);
  font-size: 13px;
  padding: 10px 14px;
  border-radius: var(--radius);
  margin-bottom: 1.25rem;
  text-align: center;
}

.submit-btn {
  width: 100%;
  background: var(--color-orange);
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  padding: 13px;
  border: none;
  border-radius: var(--radius);
  margin-top: 0.5rem;
  transition: opacity 0.15s;
}

.submit-btn:hover {
  opacity: 0.9;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.switch-link {
  text-align: center;
  font-size: 13px;
  color: var(--color-text-muted);
  margin-top: 1.5rem;
}

.switch-link :deep(a) {
  color: var(--color-blue);
  font-weight: 600;
}
</style>
