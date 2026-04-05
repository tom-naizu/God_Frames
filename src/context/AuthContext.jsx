import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

const TOKENS_KEY = 'gods_frame_tokens'
const USER_KEY = 'gods_frame_user'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isAuthenticated = !!user

  const saveAuth = (userData, tokens) => {
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens))
    setUser(userData)
    setError(null)
  }

  const register = async (email, password, confirmPassword, fullName) => {
    setLoading(true)
    setError(null)
    try {
      const res = await authAPI.register({
        email,
        password,
        confirm_password: confirmPassword,
        full_name: fullName,
      })
      saveAuth(res.data.user, res.data.tokens)
      return res.data
    } catch (err) {
      const msg = err.response?.data?.email?.[0] ||
                  err.response?.data?.password?.[0] ||
                  err.response?.data?.confirm_password?.[0] ||
                  err.response?.data?.non_field_errors?.[0] ||
                  'Registration failed'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const res = await authAPI.login({ email, password })
      saveAuth(res.data.user, res.data.tokens)
      return res.data
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.non_field_errors?.[0] || 'Invalid email or password'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  const googleLogin = async (token) => {
    setLoading(true)
    setError(null)
    try {
      const res = await authAPI.googleAuth(token)
      saveAuth(res.data.user, res.data.tokens)
      return res.data
    } catch (err) {
      const msg = err.response?.data?.error || 'Google sign-in failed'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  const sendOtp = async (phone) => {
    setLoading(true)
    setError(null)
    try {
      const res = await authAPI.sendOTP(phone)
      return res.data
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to send OTP'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (phone, otp) => {
    setLoading(true)
    setError(null)
    try {
      const res = await authAPI.verifyOTP(phone, otp)
      saveAuth(res.data.user, res.data.tokens)
      return res.data
    } catch (err) {
      const msg = err.response?.data?.error || 'OTP verification failed'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKENS_KEY)
    setUser(null)
    setError(null)
  }

  const refreshProfile = async () => {
    try {
      const res = await authAPI.getProfile()
      localStorage.setItem(USER_KEY, JSON.stringify(res.data))
      setUser(res.data)
    } catch {
      // Token might be expired
    }
  }

  // Check auth on mount
  useEffect(() => {
    const tokens = localStorage.getItem(TOKENS_KEY)
    if (tokens && user) {
      refreshProfile()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        setError,
        register,
        login,
        googleLogin,
        sendOtp,
        verifyOtp,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
