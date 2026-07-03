<script setup lang="ts">
import { ref } from "vue";
import {
  createDestination,
  deleteDestination,
  updateDestination,
} from "../services/destinations";
import type { Destination, Trip } from "../types";
import DestinationForm from "./DestinationForm.vue";

const props = defineProps<{
  trip: Trip;
}>();

const emit = defineEmits<{
  updated: [];
}>();

const showForm = ref(false);
const adding = ref(false);
const deletingId = ref<number | null>(null);
const editingDest = ref<Destination | null>(null);
const saving = ref(false);

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function handleAdd(data: any) {
  adding.value = true;
  try {
    await createDestination(props.trip.id, {
      ...data,
      order: props.trip.destinations.length,
    });
    showForm.value = false;
    emit("updated");
  } finally {
    adding.value = false;
  }
}

async function handleEdit(data: any) {
  if (!editingDest.value) return;
  saving.value = true;
  try {
    await updateDestination(props.trip.id, editingDest.value.id, data);
    editingDest.value = null;
    emit("updated");
  } finally {
    saving.value = false;
  }
}

async function handleDelete(dest: Destination) {
  deletingId.value = dest.id;
  try {
    await deleteDestination(props.trip.id, dest.id);
    emit("updated");
  } finally {
    deletingId.value = null;
  }
}

function startEdit(dest: Destination) {
  editingDest.value = dest;
  showForm.value = false;
}
</script>

<template>
  <div class="dest-list">
    <div class="list-header">
      <h2>Itinerary</h2>
      <button
        class="add-btn"
        @click="
          showForm = !showForm;
          editingDest = null;
        "
      >
        {{ showForm ? "Cancel" : "+ Add destination" }}
      </button>
    </div>

    <DestinationForm
      v-if="showForm"
      :loading="adding"
      :order="trip.destinations.length"
      :trip="trip"
      @submit="handleAdd"
      @cancel="showForm = false"
    />

    <div v-if="trip.destinations.length === 0 && !showForm" class="empty">
      <span>🗺️</span>
      <p>No destinations yet — add your first stop.</p>
    </div>

    <div v-else class="destinations">
      <div
        v-for="(dest, index) in trip.destinations"
        :key="dest.id"
        class="dest-item"
      >
        <div class="dest-line">
          <div class="dest-dot">{{ index + 1 }}</div>
          <div
            class="dest-connector"
            v-if="index < trip.destinations.length - 1"
          ></div>
        </div>
        <div class="dest-content">
          <div v-if="editingDest?.id === dest.id">
            <DestinationForm
              :loading="saving"
              :order="dest.order"
              :trip="trip"
              :editing="dest"
              @submit="handleEdit"
              @cancel="editingDest = null"
            />
          </div>
          <div v-else>
            <div class="dest-header">
              <span class="dest-name">{{ dest.name }}</span>
              <div class="dest-actions">
                <button class="edit-btn" @click="startEdit(dest)">Edit</button>
                <button
                  class="delete-btn"
                  :disabled="deletingId === dest.id"
                  @click="handleDelete(dest)"
                >
                  {{ deletingId === dest.id ? "..." : "Delete" }}
                </button>
              </div>
            </div>
            <span class="dest-dates"
              >{{ formatDate(dest.date_from) }} –
              {{ formatDate(dest.date_to) }}</span
            >
            <p v-if="dest.notes" class="dest-notes">{{ dest.notes }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dest-list {
  margin-top: 1.75rem;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.list-header h2 {
  font-size: 16px;
  font-weight: 600;
}

.add-btn {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-blue);
  background: var(--color-blue-bg);
  border: none;
  border-radius: var(--radius);
  padding: 7px 14px;
}

.empty {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-muted);
  font-size: 14px;
}

.empty span {
  font-size: 32px;
  display: block;
  margin-bottom: 8px;
}

.destinations {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.dest-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.dest-line {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  padding-top: 2px;
}

.dest-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-blue);
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dest-connector {
  width: 2px;
  height: 100%;
  min-height: 24px;
  background: var(--color-border-strong);
  margin: 4px 0;
  flex: 1;
}

.dest-content {
  flex: 1;
  padding-bottom: 1.25rem;
}

.dest-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
}

.dest-name {
  font-size: 15px;
  font-weight: 600;
}

.dest-actions {
  display: flex;
  gap: 4px;
}

.edit-btn {
  background: transparent;
  border: 1px solid var(--color-blue);
  color: var(--color-blue);
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 6px;
  transition: background 0.15s;
}

.edit-btn:hover {
  background: var(--color-blue-bg);
}

.delete-btn {
  background: transparent;
  border: 1px solid var(--color-border-strong);
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 6px;
  transition: color 0.15s, border-color 0.15s;
}

.delete-btn:hover {
  color: var(--color-danger);
  border-color: var(--color-danger);
}

.dest-dates {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.dest-notes {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-top: 4px;
}
</style>
