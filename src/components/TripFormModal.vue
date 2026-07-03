<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import FormField from "./FormField.vue";
import DestinationList from "./DestinationList.vue";
import type { Trip } from "../types";

const props = defineProps<{
  loading?: boolean;
  trip?: Trip | null;
  createdTrip?: Trip | null;
}>();

const emit = defineEmits<{
  close: [];
  submit: [
    data: {
      title: string;
      start_date: string;
      end_date: string;
      description: string;
    },
  ];
  updated: [];
}>();

const title = ref("");
const startDate = ref<Date | null>(null);
const endDate = ref<Date | null>(null);
const description = ref("");
const dateError = ref("");
const step = ref(1);

const isEditing = computed(() => !!props.trip);

onMounted(() => {
  if (props.trip) {
    title.value = props.trip.title;
    startDate.value = new Date(props.trip.start_date);
    endDate.value = new Date(props.trip.end_date);
    description.value = props.trip.description || "";
  }
});

watch(
  () => props.createdTrip,
  (val) => {
    if (val) {
      step.value = 2;
    }
  },
);

function toIsoDate(date: Date) {
  return date.toISOString().split("T")[0];
}

function handleSubmit() {
  dateError.value = "";
  if (!startDate.value || !endDate.value) {
    dateError.value = "Please select both dates";
    return;
  }
  if (endDate.value < startDate.value) {
    dateError.value = "End date must be after start date";
    return;
  }
  emit("submit", {
    title: title.value,
    start_date: toIsoDate(startDate.value),
    end_date: toIsoDate(endDate.value),
    description: description.value,
  });
}
</script>

<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <div class="header-left">
          <h2>
            {{
              isEditing
                ? "Edit trip"
                : step === 1
                  ? "New trip"
                  : "Add destinations"
            }}
          </h2>
          <div v-if="!isEditing" class="steps">
            <span :class="['step', step === 1 ? 'active' : 'done']">1</span>
            <div class="step-line"></div>
            <span :class="['step', step === 2 ? 'active' : '']">2</span>
          </div>
        </div>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <!-- Step 1: Trip info -->
      <form
        v-if="step === 1 || isEditing"
        @submit.prevent="handleSubmit"
      >
        <FormField v-model="title" label="Trip title" />

        <div class="row">
          <div class="field">
            <label>Start date</label>
            <VueDatePicker
              v-model="startDate"
              :enable-time-picker="false"
              :teleport="true"
              format="MMM d, yyyy"
              :auto-apply="true"
              placeholder="Select date"
            />
          </div>
          <div class="field">
            <label>End date</label>
            <VueDatePicker
              v-model="endDate"
              :enable-time-picker="false"
              :teleport="true"
              format="MMM d, yyyy"
              :auto-apply="true"
              placeholder="Select date"
            />
          </div>
        </div>

        <p v-if="dateError" class="date-error">{{ dateError }}</p>

        <div class="field">
          <label>Description</label>
          <textarea
            v-model="description"
            rows="3"
            placeholder="What's this trip about?"
          ></textarea>
        </div>

        <div class="actions">
          <button type="button" class="cancel-btn" @click="$emit('close')">
            Cancel
          </button>
          <button
            v-if="isEditing"
            type="submit"
            class="submit-btn"
            :disabled="loading"
          >
            {{ loading ? "Saving..." : "Save changes" }}
          </button>
          <button v-else type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? "Creating..." : "Next →" }}
          </button>

        </div>
      </form>

      <!-- Step 2: Destinations (only when creating) -->
      <div v-if="step === 2 && !isEditing && createdTrip">
        <DestinationList :trip="createdTrip" @updated="$emit('updated')" />
        <div class="actions" style="margin-top: 1.5rem">
          <button type="button" class="cancel-btn" @click="step = 1">
            ← Back
          </button>
          <button type="button" class="submit-btn" @click="$emit('close')">
            Done
          </button>
        </div>
      </div>

      <div
        v-if="step === 2 && !isEditing && !createdTrip"
        class="creating-state"
      >
        <p>Creating your trip...</p>
      </div>

      <!-- Edit mode: destinations below -->
      <div v-if="isEditing && trip">
        <div class="divider"></div>
        <DestinationList :trip="trip" @updated="$emit('updated')" />
      </div>
    </div>
  </div>
</template>

<style scoped>
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

.modal {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 2px solid var(--color-blue);
  padding: 2rem;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

h2 {
  font-size: 19px;
  font-weight: 600;
}

.steps {
  display: flex;
  align-items: center;
  gap: 6px;
}

.step {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-border);
  color: var(--color-text-muted);
}

.step.active {
  background: var(--color-blue);
  color: #ffffff;
}

.step.done {
  background: var(--color-orange);
  color: #ffffff;
}

.step-line {
  width: 24px;
  height: 2px;
  background: var(--color-border);
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  font-size: 16px;
  padding: 4px 8px;
  border-radius: 6px;
}

.close-btn:hover {
  color: var(--color-text);
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.field {
  margin-bottom: 1.1rem;
}

.field label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: 6px;
}

textarea {
  width: 100%;
  background: var(--color-bg);
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
  padding: 11px 14px;
  color: var(--color-text);
  font-size: 14px;
  resize: vertical;
  font-family: var(--font-sans);
}

textarea:focus {
  outline: none;
  border-color: var(--color-blue);
}

.date-error {
  color: var(--color-danger);
  font-size: 13px;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 1.5rem;
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

.submit-btn {
  flex: 1;
  background: var(--color-orange);
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  padding: 11px;
  border: none;
  border-radius: var(--radius);
}

.submit-btn:disabled {
  opacity: 0.5;
}

.divider {
  border: none;
  border-top: 2px solid var(--color-border);
  margin: 1.75rem 0;
}

.creating-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-muted);
  font-size: 14px;
}
</style>
