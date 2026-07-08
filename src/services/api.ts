// production build
import axios from 'axios'

// Get the API URL from environment or use default
const envApiUrl = import.meta.env.VITE_API_URL
const defaultApiUrl = 'https://wanderlog-backend-production.up.railway.app/api'

console.log('ENV VITE_API_URL:', envApiUrl)
console.log('import.meta.env:', import.meta.env)

// Use environment variable if available, otherwise use default
let baseURL = envApiUrl || defaultApiUrl

// Remove trailing slash to avoid double slashes
baseURL = baseURL.replace(/\/$/, '')

// Force HTTPS in production - CRITICAL FIX
if (baseURL.includes('railway.app') && baseURL.startsWith('http://')) {
  console.warn('WARNING: API URL was HTTP, forcing to HTTPS')
  baseURL = baseURL.replace('http://', 'https://')
}

console.log('Final API URL:', baseURL)

const api = axios.create({ 
  baseURL
})

api.interceptors.request.use((config) => {
  // CRITICAL: Force HTTPS for Railway URLs
  if (config.baseURL && config.baseURL.includes('railway.app')) {
    if (config.baseURL.startsWith('http://')) {
      console.warn('WARNING: baseURL was HTTP in interceptor, forcing HTTPS')
      config.baseURL = config.baseURL.replace('http://', 'https://')
    }
  }
  
  // If URL is absolute and contains railway.app, force HTTPS
  if (config.url && config.url.includes('railway.app') && config.url.startsWith('http://')) {
    console.warn('WARNING: url was HTTP in interceptor, forcing HTTPS')
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

// Add response interceptor to catch any redirect issues
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    if (error.config) {
      console.error('Failed request URL:', error.config.url)
      console.error('Failed request baseURL:', error.config.baseURL)
    }
    return Promise.reject(error)
  }
)

export default api