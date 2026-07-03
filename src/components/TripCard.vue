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
      <span v-if="trip.destinations.length > 0" class="dest-count">
        {{ trip.destinations.length }} {{ trip.destinations.length === 1 ? 'destination' : 'destinations' }}
      </span>
    </div>
    <h3>{{ trip.title }}</h3>
    <p v-if="trip.destinations.length > 0" class="destinations-preview">
      {{ trip.destinations.map(d => d.name).join(' → ') }}
    </p>
    <p v-else class="no-destinations">No destinations yet</p>
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.emoji {
  font-size: 28px;
}

.dest-count {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-blue);
  background: var(--color-blue-bg);
  border-radius: 20px;
  padding: 3px 10px;
}

h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.destinations-preview {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-destinations {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-bottom: 6px;
}

.dates {
  font-size: 12px;
  color: var(--color-text-muted);
}
</style>