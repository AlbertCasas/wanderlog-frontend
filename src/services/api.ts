import axios from 'axios'

export const API_BASE_URL = 'https://wanderlog-backend-production.up.railway.app/api'

const api = axios.create({})

api.interceptors.request.use((config) => {
  if (config.url && !config.url.startsWith('http')) {
    config.url = API_BASE_URL + config.url
  }
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api

