<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="app-header">
    <div class="logo">
      <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
        <path d="M32 8 C34 8 35 10 35 13 L35 26 L52 34 C54 35 54 38 52 39 L35 36 L35 46 L41 51 C42 52 42 54 40 54 L32 51 L24 54 C22 54 22 52 23 51 L29 46 L29 36 L12 39 C10 38 10 35 12 34 L29 26 L29 13 C29 10 30 8 32 8 Z" fill="#FFFFFF" stroke="#2B6CB0" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
        <circle cx="32" cy="16" r="2" fill="#F0923B"/>
      </svg>
      <span class="logo-text">wander<span>log</span></span>
    </div>
    <button class="logout-btn" @click="handleLogout">Log out</button>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 2px solid var(--color-border);
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-blue);
}

.logo-text span {
  color: var(--color-orange);
}

.logout-btn {
  background: transparent;
  border: 2px solid var(--color-border-strong);
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: var(--radius);
  transition: border-color 0.15s, color 0.15s;
}

.logout-btn:hover {
  border-color: var(--color-text-muted);
  color: var(--color-text);
}
</style>