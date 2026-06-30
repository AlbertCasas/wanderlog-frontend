export interface User {
  id: number
  email: string
  name: string
}

export interface Trip {
  id: number
  title: string
  destination: string
  start_date: string
  end_date: string
  description: string
  user_id: number
  created_at: string
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