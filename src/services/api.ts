// production build
import axios from 'axios'

// HARDCODED HTTPS for Railway - environment variable seems to be causing issues
const baseURL = 'https://wanderlog-backend-production.up.railway.app/api'

console.log('API URL (hardcoded HTTPS):', baseURL)

const api = axios.create({ 
  baseURL
})

api.interceptors.request.use((config) => {
  console.log('Request config.baseURL:', config.baseURL)
  console.log('Request config.url:', config.url)
  
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

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