<script setup lang="ts">
defineProps<{
  label: string
  type?: string
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="field">
    <label>{{ label }}</label>
    <input
      :type="type || 'text'"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      required
    />
  </div>
</template>

<style scoped>
.field {
  margin-bottom: 1.1rem;
}

label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: 6px;
}

input {
  width: 100%;
  background: var(--color-bg);
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
  padding: 11px 14px;
  color: var(--color-text);
  font-size: 14px;
  transition: border-color 0.15s;
}

input:focus {
  outline: none;
  border-color: var(--color-blue);
}

input::placeholder {
  color: var(--color-text-muted);
}

input[type="date"] {
  color-scheme: light;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(38%) sepia(54%) saturate(1226%) hue-rotate(176deg) brightness(91%) contrast(89%);
  cursor: pointer;
  padding: 4px;
}
</style>