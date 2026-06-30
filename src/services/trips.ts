import api from './api'
import type { Trip } from '../types'

export async function getTrips(): Promise<Trip[]> {
  const response = await api.get('/trips')
  return response.data
}

export async function getTrip(id: number): Promise<Trip> {
  const response = await api.get(`/trips/${id}`)
  return response.data
}

export async function createTrip(data: Partial<Trip>): Promise<Trip> {
  const response = await api.post('/trips', data)
  return response.data
}

export async function updateTrip(id: number, data: Partial<Trip>): Promise<Trip> {
  const response = await api.put(`/trips/${id}`, data)
  return response.data
}

export async function deleteTrip(id: number): Promise<void> {
  await api.delete(`/trips/${id}`)
}