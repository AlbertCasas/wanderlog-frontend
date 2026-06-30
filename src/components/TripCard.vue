<script setup lang="ts">
import type { Trip } from '../types'

defineProps<{
  trip: Trip
}>()

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <RouterLink :to="`/trips/${trip.id}`" class="trip-card">
    <div class="card-top">
      <span class="emoji">✈️</span>
    </div>
    <h3>{{ trip.title }}</h3>
    <p class="destination">{{ trip.destination }}</p>
    <p class="dates">{{ formatDate(trip.start_date) }} – {{ formatDate(trip.end_date) }}</p>
  </RouterLink>
</template>

<style scoped>
.trip-card {
  display: block;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  transition: border-color 0.15s, transform 0.15s;
}

.trip-card:hover {
  border-color: var(--color-blue);
  transform: translateY(-2px);
}

.card-top {
  margin-bottom: 0.75rem;
}

.emoji {
  font-size: 28px;
}

h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.destination {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 6px;
}

.dates {
  font-size: 12px;
  color: var(--color-text-muted);
}
</style>