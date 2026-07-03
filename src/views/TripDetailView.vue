<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getTrip, updateTrip, deleteTrip } from "../services/trips";
import type { Trip } from "../types";
import AppHeader from "../components/AppHeader.vue";
import TripFormModal from "../components/TripFormModal.vue";
import DestinationList from "../components/DestinationList.vue";
import TripMap from "../components/TripMap.vue";
import ExpenseList from '../components/ExpenseList.vue'

const route = useRoute();
const router = useRouter();

const trip = ref<Trip | null>(null);
const loading = ref(true);
const showEditModal = ref(false);
const showDeleteConfirm = ref(false);
const saving = ref(false);
const deleting = ref(false);

async function loadTrip() {
  loading.value = true;
  trip.value = await getTrip(Number(route.params.id));
  loading.value = false;
}

async function handleUpdate(data: any) {
  saving.value = true;
  try {
    await updateTrip(Number(route.params.id), data);
    showEditModal.value = false;
    await loadTrip();
  } finally {
    saving.value = false;
  }
}

async function handleDelete() {
  deleting.value = true;
  try {
    await deleteTrip(Number(route.params.id));
    router.push("/trips");
  } finally {
    deleting.value = false;
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

onMounted(loadTrip);
</script>

<template>
  <div>
    <AppHeader />
    <main class="detail-page">
      <RouterLink to="/trips" class="back-link">← Back to trips</RouterLink>

      <div v-if="loading" class="state-message">Loading...</div>

      <div v-else-if="trip" class="trip-detail">
        <div class="detail-header">
          <div>
            <span class="emoji">✈️</span>
            <h1>{{ trip.title }}</h1>
          </div>
          <div class="header-actions">
            <button class="edit-btn" @click="showEditModal = true">Edit</button>
            <button class="delete-btn" @click="showDeleteConfirm = true">
              Delete
            </button>
          </div>
        </div>

        <div class="dates-row">
          <div class="date-block">
            <span class="date-label">Start date</span>
            <span class="date-value">{{ formatDate(trip.start_date) }}</span>
          </div>
          <div class="date-block">
            <span class="date-label">End date</span>
            <span class="date-value">{{ formatDate(trip.end_date) }}</span>
          </div>
        </div>

        <div v-if="trip.description" class="description">
          <p>{{ trip.description }}</p>
        </div>

        <TripMap :trips="[trip]" class="trip-map" />

        <DestinationList :trip="trip" @updated="loadTrip" />
        <ExpenseList :trip-id="trip.id" />
      </div>
    </main>

    <TripFormModal
      v-if="showEditModal && trip"
      :trip="trip"
      :loading="saving"
      @close="showEditModal = false"
      @submit="handleUpdate"
      @updated="loadTrip"
    />

    <div
      v-if="showDeleteConfirm"
      class="overlay"
      @click.self="showDeleteConfirm = false"
    >
      <div class="confirm-modal">
        <h2>Delete this trip?</h2>
        <p>This action cannot be undone.</p>
        <div class="confirm-actions">
          <button class="cancel-btn" @click="showDeleteConfirm = false">
            Cancel
          </button>
          <button
            class="confirm-delete-btn"
            :disabled="deleting"
            @click="handleDelete"
          >
            {{ deleting ? "Deleting..." : "Delete trip" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-page {
  max-width: 700px;
  margin: 0 auto;
  padding: 2.5rem 2rem;
}

.back-link {
  display: inline-block;
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
}

.back-link:hover {
  color: var(--color-blue);
}

.state-message {
  text-align: center;
  color: var(--color-text-muted);
  padding: 3rem 0;
}

.trip-detail {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 2rem;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.75rem;
}

.emoji {
  font-size: 32px;
  display: block;
  margin-bottom: 8px;
}

h1 {
  font-size: 24px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.edit-btn,
.delete-btn {
  font-size: 13px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: var(--radius);
}

.edit-btn {
  background: transparent;
  border: 2px solid var(--color-blue);
  color: var(--color-blue);
}

.delete-btn {
  background: transparent;
  border: 2px solid var(--color-danger);
  color: var(--color-danger);
}

.dates-row {
  display: flex;
  gap: 24px;
  padding: 1.25rem 0;
  border-top: 2px solid var(--color-border);
  border-bottom: 2px solid var(--color-border);
  margin-bottom: 1.75rem;
}

.date-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.date-label {
  font-size: 12px;
  color: var(--color-text-muted);
}

.date-value {
  font-size: 14px;
  font-weight: 500;
}

.description {
  margin-bottom: 1.75rem;
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.trip-map {
  margin-bottom: 0;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(43, 58, 74, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  z-index: 100;
}

.confirm-modal {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 2px solid var(--color-danger);
  padding: 2rem;
  width: 100%;
  max-width: 360px;
}

.confirm-modal h2 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 6px;
}

.confirm-modal p {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
}

.confirm-actions {
  display: flex;
  gap: 10px;
}

.cancel-btn {
  flex: 1;
  background: transparent;
  border: 2px solid var(--color-border-strong);
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  padding: 11px;
  border-radius: var(--radius);
}

.confirm-delete-btn {
  flex: 1;
  background: var(--color-danger);
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  padding: 11px;
  border: none;
  border-radius: var(--radius);
}

.confirm-delete-btn:disabled {
  opacity: 0.5;
}
</style>
