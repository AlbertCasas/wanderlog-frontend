<script setup lang="ts">
import { ref, onMounted } from "vue";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import FormField from "./FormField.vue";
import type { Trip } from "../types";

const props = defineProps<{
  loading?: boolean;
  trip?: Trip | null;
}>();

const emit = defineEmits<{
  close: [];
  submit: [
    data: {
      title: string;
      destination: string;
      start_date: string;
      end_date: string;
      description: string;
    },
  ];
}>();

const title = ref("");
const destination = ref("");
const startDate = ref<Date | null>(null);
const endDate = ref<Date | null>(null);
const description = ref("");
const dateError = ref("");

onMounted(() => {
  if (props.trip) {
    title.value = props.trip.title;
    destination.value = props.trip.destination;
    startDate.value = new Date(props.trip.start_date);
    endDate.value = new Date(props.trip.end_date);
    description.value = props.trip.description || "";
  }
});

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
    destination: destination.value,
    start_date: toIsoDate(startDate.value),
    end_date: toIsoDate(endDate.value),
    description: description.value,
  });
}
</script>

<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <h2>{{ trip ? "Edit trip" : "New trip" }}</h2>
      <form @submit.prevent="handleSubmit">
        <FormField v-model="title" label="Trip title" />
        <FormField v-model="destination" label="Destination" />

        <div class="row">
          <div class="field">
            <label>Start date</label>
            <VueDatePicker
              v-model="startDate"
              :enable-time-picker="false"
              format="MMM d, yyyy"
              placeholder="Select date"
            />
          </div>
          <div class="field">
            <label>End date</label>
            <VueDatePicker
              v-model="endDate"
              :enable-time-picker="false"
              format="MMM d, yyyy"
              placeholder="Select date"
            />
          </div>
        </div>

        <p v-if="dateError" class="date-error">{{ dateError }}</p>

        <div class="field">
          <label>Description</label>
          <textarea v-model="description" rows="3"></textarea>
        </div>
        <div class="actions">
          <button type="button" class="cancel-btn" @click="$emit('close')">
            Cancel
          </button>
          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? "Saving..." : trip ? "Save changes" : "Create trip" }}
          </button>

        </div>
      </form>
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
  max-width: 420px;
  max-height: 90vh;
  overflow-y: auto;
}

h2 {
  font-size: 19px;
  font-weight: 600;
  margin-bottom: 1.5rem;
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
</style>
