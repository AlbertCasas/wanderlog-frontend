import api from './api'
import type { Destination } from '../types'

export async function getDestinations(tripId: number): Promise<Destination[]> {
  const response = await api.get(`/trips/${tripId}/destinations`)
  return response.data
}

export async function createDestination(tripId: number, data: Partial<Destination>): Promise<Destination> {
  const response = await api.post(`/trips/${tripId}/destinations`, data)
  return response.data
}

export async function updateDestination(tripId: number, destId: number, data: Partial<Destination>): Promise<Destination> {
  const response = await api.put(`/trips/${tripId}/destinations/${destId}`, data)
  return response.data
}

export async function deleteDestination(tripId: number, destId: number): Promise<void> {
  await api.delete(`/trips/${tripId}/destinations/${destId}`)
}