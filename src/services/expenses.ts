import api from './api'
import type { Expense } from '../types'

export async function getExpenses(tripId: number): Promise<Expense[]> {
  const response = await api.get(`/trips/${tripId}/expenses`)
  return response.data
}

export async function createExpense(tripId: number, data: Partial<Expense>): Promise<Expense> {
  const response = await api.post(`/trips/${tripId}/expenses`, data)
  return response.data
}

export async function deleteExpense(tripId: number, expenseId: number): Promise<void> {
  await api.delete(`/trips/${tripId}/expenses/${expenseId}`)
}