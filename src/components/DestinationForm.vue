<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import DestinationAutocomplete from './DestinationAutocomplete.vue'
import FormField from "./FormField.vue";
import type { Trip, Destination } from "../types";

const props = defineProps<{
  loading?: boolean;
  order: number;
  trip: Trip;
  editing?: Destination | null;
}>();

const emit = defineEmits<{
  submit: [
    data: {
      name: string;
      date_from: string;
      date_to: string;
      notes: string;
      order: number;
      latitude?: number;
      longitude?: number;
    },
  ];
  cancel: [];
}>();

const name = ref("");
const selectedLat = ref<number | undefined>(undefined);
const selectedLng = ref<number | undefined>(undefined);
const dateFrom = ref<string | null>(null);
const dateTo = ref<string | null>(null);
const notes = ref("");
const dateError = ref("");
const nameError = ref("");

const tripStart = computed(() => new Date(props.trip.start_date));
const tripEnd = computed(() => new Date(props.trip.end_date));

const minDateFrom = computed(() => {
  if (props.editing) return tripStart.value;
  if (props.trip.destinations.length === 0) return tripStart.value;
  const lastDest = props.trip.destinations[props.trip.destinations.length - 1];
  return new Date(lastDest.date_to);
});

const minDateTo = computed(() => {
  if (!dateFrom.value) return minDateFrom.value;
  const parts = dateFrom.value.split("-");
  if (parts[0].length === 2) {
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  }
  return new Date(dateFrom.value);
});

function handlePlaceSelect(place: { name: string; lat: number; lng: number }) {
  name.value = place.name;
  selectedLat.value = place.lat;
  selectedLng.value = place.lng;
  nameError.value = "";
}

function toIsoDate(date: string) {
  const parts = date.split("-");
  if (parts[0].length === 2) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return date.split("T")[0];
}

function handleSubmit() {
  dateError.value = "";
  nameError.value = "";

  if (!name.value) {
    nameError.value = "Please select a destination from the list";
    return;
  }
  if (!selectedLat.value && !props.editing) {
    nameError.value = "Please select a destination from the suggestions";
    return;
  }
  if (!dateFrom.value || !dateTo.value) {
    dateError.value = "Please select both dates";
    return;
  }

  const from = new Date(toIsoDate(dateFrom.value));
  const to = new Date(toIsoDate(dateTo.value));

  if (to < from) {
    dateError.value = "Departure must be after arrival";
    return;
  }
  if (from < tripStart.value || to > tripEnd.value) {
    dateError.value = "Dates must be within the trip range";
    return;
  }

  emit("submit", {
    name: name.value,
    date_from: toIsoDate(dateFrom.value),
    date_to: toIsoDate(dateTo.value),
    notes: notes.value,
    order: props.order,
    latitude: selectedLat.value,
    longitude: selectedLng.value,
  });
}

onMounted(() => {
  if (props.editing) {
    name.value = props.editing.name;
    selectedLat.value = props.editing.latitude ?? undefined;
    selectedLng.value = props.editing.longitude ?? undefined;

    const fromDate = new Date(props.editing.date_from);
    const dd1 = String(fromDate.getDate()).padStart(2, "0");
    const mm1 = String(fromDate.getMonth() + 1).padStart(2, "0");
    dateFrom.value = `${dd1}-${mm1}-${fromDate.getFullYear()}`;

    const toDate = new Date(props.editing.date_to);
    const dd2 = String(toDate.getDate()).padStart(2, "0");
    const mm2 = String(toDate.getMonth() + 1).padStart(2, "0");
    dateTo.value = `${dd2}-${mm2}-${toDate.getFullYear()}`;
    return;
  }

  const destinations = props.trip.destinations;
  if (destinations.length === 0) {
    const start = new Date(props.trip.start_date);
    const dd = String(start.getDate()).padStart(2, "0");
    const mm = String(start.getMonth() + 1).padStart(2, "0");
    dateFrom.value = `${dd}-${mm}-${start.getFullYear()}`;
  } else {
    const lastDest = destinations[destinations.length - 1];
    const prev = new Date(lastDest.date_to);
    const dd = String(prev.getDate()).padStart(2, "0");
    const mm = String(prev.getMonth() + 1).padStart(2, "0");
    dateFrom.value = `${dd}-${mm}-${prev.getFullYear()}`;
  }
});
</script>

<template>
  <div class="dest-form">
    <DestinationAutocomplete
      v-model="name"
      :initial-value="editing?.name || ''"
      @select="handlePlaceSelect"
    />
    <p v-if="nameError" class="field-error">{{ nameError }}</p>

    <div class="row">
      <div class="field">
        <label>Arrival</label>
        <VueDatePicker
          v-model="dateFrom"
          :enable-time-picker="false"
          :teleport="true"
          model-type="format"
          format="dd-MM-yyyy"
          :min-date="tripStart"
          :max-date="tripEnd"
          :start-date="editing ? new Date(editing.date_from) : minDateFrom"
          :auto-apply="true"
          placeholder="Select date"
        />
      </div>
      <div class="field">
        <label>Departure</label>
        <VueDatePicker
          v-model="dateTo"
          :enable-time-picker="false"
          :teleport="true"
          model-type="format"
          format="dd-MM-yyyy"
          :min-date="editing ? tripStart : minDateTo"
          :max-date="tripEnd"
          :start-date="editing ? new Date(editing.date_to) : minDateTo"
          :auto-apply="true"
          placeholder="Select date"
        />
      </div>
    </div>
    <p v-if="dateError" class="field-error">{{ dateError }}</p>
    <FormField v-model="notes" label="Notes (optional)" />
    <div class="actions">
      <button type="button" class="cancel-btn" @click="$emit('cancel')">
        Cancel
      </button>
      <button
        type="button"
        class="submit-btn"
        :disabled="loading"
        @click="handleSubmit"
      >
        {{
          loading ? "Saving..." : editing ? "Save changes" : "Add destination"
        }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.dest-form {
  background: var(--color-bg);
  border: 2px solid var(--color-blue);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  margin-top: 1rem;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 1.1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.field-error {
  color: var(--color-danger);
  font-size: 13px;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 0.5rem;
}

.cancel-btn {
  flex: 1;
  background: transparent;
  border: 2px solid var(--color-border-strong);
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 500;
  padding: 9px;
  border-radius: var(--radius);
}

.submit-btn {
  flex: 1;
  background: var(--color-blue);
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  padding: 9px;
  border: none;
  border-radius: var(--radius);
}

.submit-btn:disabled {
  opacity: 0.5;
}
</style>
