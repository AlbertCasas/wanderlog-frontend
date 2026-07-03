<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getExpenses, createExpense, deleteExpense } from '../services/expenses'
import type { Expense } from '../types'

const props = defineProps<{
  tripId: number
}>()

const expenses = ref<Expense[]>([])
const loading = ref(true)
const showForm = ref(false)
const adding = ref(false)
const deletingId = ref<number | null>(null)

const title = ref('')
const amount = ref('')
const category = ref('other')
const date = ref('')

const categories = [
  { value: 'transport', label: '🚂 Transport' },
  { value: 'accommodation', label: '🏨 Accommodation' },
  { value: 'food', label: '🍜 Food' },
  { value: 'activities', label: '🎭 Activities' },
  { value: 'other', label: '📦 Other' }
]

const categoryLabel = (val: string) => categories.find(c => c.value === val)?.label || val

const total = computed(() => expenses.value.reduce((sum, e) => sum + e.amount, 0))

const byCategory = computed(() => {
  const map: Record<string, number> = {}
  expenses.value.forEach(e => {
    map[e.category] = (map[e.category] || 0) + e.amount
  })
  return map
})

async function loadExpenses() {
  loading.value = true
  expenses.value = await getExpenses(props.tripId)
  loading.value = false
}

async function handleAdd() {
  if (!title.value || !amount.value || !date.value) return
  adding.value = true
  try {
    await createExpense(props.tripId, {
      title: title.value,
      amount: parseFloat(amount.value),
      category: category.value,
      date: date.value
    })
    title.value = ''
    amount.value = ''
    category.value = 'other'
    date.value = ''
    showForm.value = false
    await loadExpenses()
  } finally {
    adding.value = false
  }
}

async function handleDelete(expense: Expense) {
  deletingId.value = expense.id
  try {
    await deleteExpense(props.tripId, expense.id)
    await loadExpenses()
  } finally {
    deletingId.value = null
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(loadExpenses)
</script>

<template>
  <div class="expenses">
    <div class="expenses-header">
      <h2>Expenses</h2>
      <button class="add-btn" @click="showForm = !showForm">
        {{ showForm ? 'Cancel' : '+ Add expense' }}
      </button>
    </div>

    <div v-if="showForm" class="expense-form">
      <div class="form-row">
        <div class="field">
          <label>Title</label>
          <input v-model="title" type="text" placeholder="e.g. Flight tickets" />
        </div>
        <div class="field field-sm">
          <label>Amount (€)</label>
          <input v-model="amount" type="number" min="0" step="0.01" placeholder="0.00" />
        </div>
      </div>
      <div class="form-row">
        <div class="field">
          <label>Category</label>
          <select v-model="category">
            <option v-for="cat in categories" :key="cat.value" :value="cat.value">
              {{ cat.label }}
            </option>
          </select>
        </div>
        <div class="field">
          <label>Date</label>
          <input v-model="date" type="date" />
        </div>
      </div>
      <div class="form-actions">
        <button class="cancel-btn" @click="showForm = false">Cancel</button>
        <button class="submit-btn" :disabled="adding" @click="handleAdd">
          {{ adding ? 'Adding...' : 'Add expense' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="state-msg">Loading expenses...</div>

    <div v-else-if="expenses.length === 0 && !showForm" class="empty">
      <span>💸</span>
      <p>No expenses yet — track your spending.</p>
    </div>

    <div v-else-if="expenses.length > 0">
      <div class="summary">
        <div class="total">
          <span class="total-label">Total</span>
          <span class="total-amount">€{{ total.toFixed(2) }}</span>
        </div>
        <div class="by-category">
          <div v-for="(amount, cat) in byCategory" :key="cat" class="cat-row">
            <span class="cat-label">{{ categoryLabel(cat) }}</span>
            <span class="cat-amount">€{{ amount.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <div class="expense-list">
        <div v-for="expense in expenses" :key="expense.id" class="expense-item">
          <div class="expense-left">
            <span class="expense-cat">{{ categoryLabel(expense.category) }}</span>
            <span class="expense-title">{{ expense.title }}</span>
            <span class="expense-date">{{ formatDate(expense.date) }}</span>
          </div>
          <div class="expense-right">
            <span class="expense-amount">€{{ expense.amount.toFixed(2) }}</span>
            <button
              class="delete-btn"
              :disabled="deletingId === expense.id"
              @click="handleDelete(expense)"
            >
              {{ deletingId === expense.id ? '...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.expenses {
  margin-top: 2rem;
  border-top: 2px solid var(--color-border);
  padding-top: 1.75rem;
}

.expenses-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.expenses-header h2 {
  font-size: 16px;
  font-weight: 600;
}

.add-btn {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-orange);
  background: var(--color-orange-bg);
  border: none;
  border-radius: var(--radius);
  padding: 7px 14px;
}

.expense-form {
  background: var(--color-bg);
  border: 2px solid var(--color-orange);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 1rem;
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

.field input, .field select {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
  padding: 10px 12px;
  color: var(--color-text);
  font-size: 14px;
  font-family: var(--font-sans);
}

.field input:focus, .field select:focus {
  outline: none;
  border-color: var(--color-orange);
}

.form-actions {
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
  background: var(--color-orange);
  color: #FFFFFF;
  font-size: 13px;
  font-weight: 600;
  padding: 9px;
  border: none;
  border-radius: var(--radius);
}

.submit-btn:disabled {
  opacity: 0.5;
}

.state-msg {
  text-align: center;
  color: var(--color-text-muted);
  padding: 2rem 0;
  font-size: 14px;
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

.summary {
  background: var(--color-bg);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  margin-bottom: 1rem;
}

.total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.total-label {
  font-size: 14px;
  font-weight: 600;
}

.total-amount {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-orange);
}

.by-category {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cat-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.cat-label {
  color: var(--color-text-secondary);
}

.cat-amount {
  font-weight: 500;
}

.expense-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.expense-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
  padding: 12px 16px;
}

.expense-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.expense-cat {
  font-size: 11px;
  color: var(--color-text-muted);
}

.expense-title {
  font-size: 14px;
  font-weight: 500;
}

.expense-date {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.expense-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.expense-amount {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-orange);
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
</style>