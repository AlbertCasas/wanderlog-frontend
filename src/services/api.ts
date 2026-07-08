// production build
import axios from 'axios'

const baseURL = (import.meta.env.VITE_API_URL || 'https://wanderlog-backend-production.up.railway.app/api').replace(/\/?$/, '/')

console.log('API URL:', baseURL)

const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  console.log('Request URL:', config.baseURL, config.url)
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api