// production build
import axios from 'axios'

// Export the base URL as a constant
export const API_BASE_URL = 'https://wanderlog-backend-production.up.railway.app/api'

console.log('API Base URL:', API_BASE_URL)

// Create axios instance WITHOUT baseURL to avoid any protocol issues
const api = axios.create({})

api.interceptors.request.use((config) => {
  // If the URL is relative, prepend the base URL manually
  if (config.url && !config.url.startsWith('http')) {
    config.url = API_BASE_URL + config.url
  }
  
  console.log('Final request URL:', config.url)
  
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    if (error.config) {
      console.error('Failed request URL:', error.config.url)
    }
    return Promise.reject(error)
  }
)
// Add response interceptor to catch any issues
api.interceptors.response.use(
  (response) => {
    console.log('Response received from:', response.config.url)
    return response
  },
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