<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
  initialValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'select': [place: { name: string; lat: number; lng: number }]
}>()

const query = ref(props.initialValue || props.modelValue || '')
const selected = ref(!!(props.initialValue || props.modelValue))
const suggestions = ref<Array<{ display_name: string; lat: string; lon: string }>>([])
const showDropdown = ref(false)
const loading = ref(false)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(() => props.modelValue, (val) => {
  if (val && query.value !== val) {
    query.value = val
    selected.value = true
  }
}, { immediate: true })

watch(query, (val) => {
  if (selected.value) {
    selected.value = false
    return
  }
  emit('update:modelValue', val)
  if (debounceTimer) clearTimeout(debounceTimer)
  if (!val || val.length < 2) {
    suggestions.value = []
    showDropdown.value = false
    return
  }
  debounceTimer = setTimeout(() => searchPlaces(val), 400)
})

async function searchPlaces(q: string) {
  loading.value = true
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5`,
      { headers: { 'User-Agent': 'wanderlog-app' } }
    )
    suggestions.value = await res.json()
    showDropdown.value = suggestions.value.length > 0
  } catch {
    suggestions.value = []
  } finally {
    loading.value = false
  }
}

function selectSuggestion(s: { display_name: string; lat: string; lon: string }) {
  const shortName = s.display_name.split(',').slice(0, 2).join(',').trim()
  query.value = shortName
  showDropdown.value = false
  selected.value = true
  suggestions.value = []
  emit('update:modelValue', shortName)
  emit('select', { name: shortName, lat: parseFloat(s.lat), lng: parseFloat(s.lon) })
}

function handleBlur() {
  setTimeout(() => { showDropdown.value = false }, 200)
}
</script>

<template>
  <div class="autocomplete">
    <label>Destination</label>
    <div class="input-wrap">
      <input
        v-model="query"
        type="text"
        placeholder="Search a city or place..."
        @blur="handleBlur"
        @focus="!selected && (showDropdown = suggestions.length > 0)"
        autocomplete="off"
      />
      <span v-if="loading" class="spinner">⟳</span>
    </div>
    <div v-if="showDropdown" class="dropdown">
      <button
        v-for="s in suggestions"
        :key="s.display_name"
        type="button"
        class="suggestion"
        @click="selectSuggestion(s)"
      >
        <span class="suggestion-icon">📍</span>
        <span class="suggestion-text">{{ s.display_name }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.autocomplete {
  position: relative;
  margin-bottom: 1.1rem;
}

label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: 6px;
}

.input-wrap {
  position: relative;
}

input {
  width: 100%;
  background: var(--color-bg);
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
  padding: 11px 14px;
  color: var(--color-text);
  font-size: 14px;
  font-family: var(--font-sans);
  transition: border-color 0.15s;
}

input:focus {
  outline: none;
  border-color: var(--color-blue);
}

input::placeholder {
  color: var(--color-text-muted);
}

.spinner {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: var(--color-text-muted);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: translateY(-50%) rotate(360deg); }
}

.dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: var(--color-surface);
  border: 2px solid var(--color-blue);
  border-radius: var(--radius-lg);
  overflow: hidden;
  z-index: 200;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.suggestion {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  padding: 10px 14px;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background 0.1s;
}

.suggestion:hover {
  background: var(--color-bg);
}

.suggestion-icon {
  flex-shrink: 0;
  font-size: 14px;
  margin-top: 1px;
}

.suggestion-text {
  font-size: 13px;
  color: var(--color-text);
  line-height: 1.4;
}
</style>