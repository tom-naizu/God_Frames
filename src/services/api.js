import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add JWT token
api.interceptors.request.use(
  (config) => {
    const tokens = JSON.parse(localStorage.getItem('gods_frame_tokens') || '{}')
    if (tokens.access) {
      config.headers.Authorization = `Bearer ${tokens.access}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const tokens = JSON.parse(localStorage.getItem('gods_frame_tokens') || '{}')
        if (tokens.refresh) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: tokens.refresh,
          })

          const newTokens = {
            access: response.data.access,
            refresh: response.data.refresh || tokens.refresh,
          }
          localStorage.setItem('gods_frame_tokens', JSON.stringify(newTokens))

          originalRequest.headers.Authorization = `Bearer ${newTokens.access}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        localStorage.removeItem('gods_frame_tokens')
        localStorage.removeItem('gods_frame_user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// ===== AUTH APIs =====
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  googleAuth: (token) => api.post('/auth/google/', { token }),
  sendOTP: (phone) => api.post('/auth/send-otp/', { phone }),
  verifyOTP: (phone, otp) => api.post('/auth/verify-otp/', { phone, otp }),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.put('/auth/profile/update/', data),
}

// ===== PRODUCT APIs =====
export const productAPI = {
  getAll: (category) => api.get('/products/', { params: category ? { category } : {} }),
  getById: (id) => api.get(`/products/${id}/`),
  getCategories: () => api.get('/products/categories/'),
}

// ===== CART APIs =====
export const cartAPI = {
  get: () => api.get('/orders/cart/'),
  add: (productId, quantity = 1) => api.post('/orders/cart/add/', { product_id: productId, quantity }),
  update: (itemId, quantity) => api.put(`/orders/cart/update/${itemId}/`, { quantity }),
  remove: (itemId) => api.delete(`/orders/cart/remove/${itemId}/`),
  clear: () => api.delete('/orders/cart/clear/'),
}

// ===== ORDER APIs =====
export const orderAPI = {
  checkout: (data) => api.post('/orders/checkout/', data),
  getAll: () => api.get('/orders/'),
  getById: (id) => api.get(`/orders/${id}/`),
}

// ===== PAYMENT APIs =====
export const paymentAPI = {
  createOrder: (orderId) => api.post('/payments/create-order/', { order_id: orderId }),
  verify: (data) => api.post('/payments/verify/', data),
}

export default api
