export interface User {
  id: number
  email: string
  name: string
}

export interface Destination {
  id: number
  trip_id: number
  name: string
  date_from: string
  date_to: string
  notes?: string
  order: number
  latitude?: number
  longitude?: number
}

export interface Trip {
  id: number
  title: string
  start_date: string
  end_date: string
  description?: string
  user_id: number
  destinations: Destination[]
}

export interface Expense {
  id: number
  trip_id: number
  title: string
  amount: number
  category: string
  date: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
}