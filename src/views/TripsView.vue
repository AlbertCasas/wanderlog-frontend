<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getTrips, createTrip } from '../services/trips'
import type { Trip } from '../types'
import AppHeader from '../components/AppHeader.vue'
import TripCard from '../components/TripCard.vue'
import TripFormModal from '../components/TripFormModal.vue'
import TripMap from '../components/TripMap.vue'

const trips = ref<Trip[]>([])
const loading = ref(true)
const showModal = ref(false)
const creating = ref(false)
const createdTrip = ref<Trip | null>(null)

async function loadTrips() {
  loading.value = true
  trips.value = await getTrips()
  loading.value = false
}

async function handleCreate(data: any) {
  creating.value = true
  try {
    const newTrip = await createTrip(data)
    createdTrip.value = { ...newTrip, destinations: [] }
    await loadTrips()
  } finally {
    creating.value = false
  }
}

async function handleModalUpdated() {
  await loadTrips()
  if (createdTrip.value) {
    const updated = trips.value.find(t => t.id === createdTrip.value!.id)
    if (updated) createdTrip.value = updated
  }
}

async function handleModalClose() {
  showModal.value = false
  createdTrip.value = null
  await loadTrips()
}

function openModal() {
  createdTrip.value = null
  showModal.value = true
}

onMounted(loadTrips)
</script>

<template>
  <div>
    <AppHeader />
    <main class="trips-page">
      <div class="page-header">
        <div>
          <h1>Your trips</h1>
          <p>Plan, track and relive your adventures.</p>
        </div>
        <button class="new-trip-btn" @click="openModal">
          + New trip
        </button>
      </div>

      <div v-if="loading" class="state-message">Loading your trips...</div>

      <template v-else>
        <TripMap :trips="trips" class="map-section" />

        <div v-if="trips.length === 0" class="empty-state">
          <span class="emoji">🧳</span>
          <h2>No trips yet</h2>
          <p>Start planning your first adventure.</p>
          <button class="new-trip-btn" @click="openModal">+ Create your first trip</button>
        </div>

        <div v-else class="trips-grid">
          <TripCard v-for="trip in trips" :key="trip.id" :trip="trip" />
        </div>
      </template>
    </main>

    <TripFormModal
      v-if="showModal"
      :loading="creating"
      :created-trip="createdTrip"
      @close="handleModalClose"
      @submit="handleCreate"
      @updated="handleModalUpdated"
    />
  </div>
</template>

<style scoped>
.trips-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2.5rem 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
}

h1 {
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 4px;
}

.page-header p {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.new-trip-btn {
  background: var(--color-orange);
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
  padding: 11px 20px;
  border: none;
  border-radius: var(--radius);
  white-space: nowrap;
}

.map-section {
  margin-bottom: 2rem;
}

.state-message {
  text-align: center;
  color: var(--color-text-muted);
  padding: 3rem 0;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--color-surface);
  border: 2px dashed var(--color-border-strong);
  border-radius: var(--radius-lg);
}

.empty-state .emoji {
  font-size: 40px;
  display: block;
  margin-bottom: 1rem;
}

.empty-state h2 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 6px;
}

.empty-state p {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
}

.trips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}
</style>