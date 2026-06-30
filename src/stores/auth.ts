import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'
import type { User, LoginCredentials, RegisterData } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value)

  async function login(credentials: LoginCredentials) {
    const response = await api.post('/auth/login', credentials)
    token.value = response.data.access_token
    localStorage.setItem('token', response.data.access_token)
    await fetchUser()
  }

  async function register(data: RegisterData) {
    await api.post('/auth/register', data)
    await login({ email: data.email, password: data.password })
  }

  async function fetchUser() {
    const response = await api.get('/auth/me')
    user.value = response.data
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  return { user, token, isAuthenticated, login, register, fetchUser, logout }
})