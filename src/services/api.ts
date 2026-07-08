// production build
import axios from 'axios'

let baseURL = (import.meta.env.VITE_API_URL || 'https://wanderlog-backend-production.up.railway.app/api')

// Remove trailing slash to avoid double slashes
baseURL = baseURL.replace(/\/$/, '')

// Force HTTPS in production
if (!baseURL.startsWith('http://localhost') && baseURL.startsWith('http://')) {
  baseURL = baseURL.replace('http://', 'https://')
}

console.log('API URL:', baseURL)

const api = axios.create({ 
  baseURL
})

api.interceptors.request.use((config) => {
  // Force HTTPS in production - check both baseURL and final URL
  if (config.baseURL && !config.baseURL.includes('localhost')) {
    if (config.baseURL.startsWith('http://')) {
      config.baseURL = config.baseURL.replace('http://', 'https://')
    }
  }
  
  // If URL is absolute and not localhost, force HTTPS
  if (config.url && config.url.startsWith('http://') && !config.url.includes('localhost')) {
    config.url = config.url.replace('http://', 'https://')
  }
  
  console.log('Request URL:', config.baseURL, config.url)
  if (config.baseURL && config.url) {
    console.log('Full URL:', config.baseURL + config.url)
  }
  
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api