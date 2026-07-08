// production build
import axios from 'axios'

let baseURL = (import.meta.env.VITE_API_URL || 'https://wanderlog-backend-production.up.railway.app/api').replace(/\/?$/, '/')

// Force HTTPS in production
if (!baseURL.startsWith('http://localhost') && baseURL.startsWith('http://')) {
  baseURL = baseURL.replace('http://', 'https://')
}

console.log('API URL:', baseURL)

const api = axios.create({ 
  baseURL,
  // Force protocol to https in production
  httpsAgent: typeof window === 'undefined' ? undefined : undefined
})

api.interceptors.request.use((config) => {
  // Force HTTPS in production
  if (config.url && !config.url.startsWith('http://localhost')) {
    if (config.baseURL && config.baseURL.startsWith('http://')) {
      config.baseURL = config.baseURL.replace('http://', 'https://')
    }
  }
  
  console.log('Request URL:', config.baseURL, config.url)
  console.log('Full URL:', config.baseURL + config.url)
  
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api