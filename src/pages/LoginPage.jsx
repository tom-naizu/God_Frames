import { useState } from 'react'
import { Link } from 'react-router-dom'

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!isLogin && !formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Min 6 characters'
    if (!isLogin && formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords don\'t match'
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/images/home-background.jpg')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-spiritual-900/80 via-spiritual-800/70 to-spiritual-900/80 backdrop-blur-sm"></div>
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-gold-400/10 rounded-full blur-[100px] animate-float"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-spiritual-400/10 rounded-full blur-[100px] animate-float delay-500"></div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-outfit font-semibold rounded-full shadow-2xl shadow-green-500/30 animate-fade-in-up flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {isLogin ? 'Login Successful! Welcome back ✨' : 'Account Created! Welcome to Gods_Frame ✨'}
        </div>
      )}

      {/* Card */}
      <div className="relative w-full max-w-md">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-spiritual-200 hover:text-gold-300 font-poppins mb-6 transition-colors group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <div className="glass rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Card decorative gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-spiritual-400 via-gold-400 to-saffron-400"></div>

          {/* Logo */}
          <div className="text-center mb-8">
            <img src="/images/LOGO.jpg" alt="Gods_Frame Logo" className="w-16 h-16 inline-block animate-float rounded-full object-contain mx-auto" />
            <h2 className="mt-3 text-2xl font-bold font-outfit gradient-text">
              {isLogin ? 'Welcome Back' : 'Join Gods_Frame'}
            </h2>
            <p className="mt-1 text-sm text-spiritual-500 font-poppins font-light">
              {isLogin ? 'Sign in to continue your divine journey' : 'Create an account to start shopping'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-spiritual-100 rounded-xl p-1 mb-8">
            <button
              onClick={() => { setIsLogin(true); setErrors({}) }}
              className={`flex-1 py-2.5 text-sm font-outfit font-semibold rounded-lg transition-all duration-300 ${
                isLogin
                  ? 'bg-white text-spiritual-700 shadow-md'
                  : 'text-spiritual-500 hover:text-spiritual-600'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setIsLogin(false); setErrors({}) }}
              className={`flex-1 py-2.5 text-sm font-outfit font-semibold rounded-lg transition-all duration-300 ${
                !isLogin
                  ? 'bg-white text-spiritual-700 shadow-md'
                  : 'text-spiritual-500 hover:text-spiritual-600'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name (Register only) */}
            {!isLogin && (
              <div className="animate-fade-in">
                <label className="block text-xs text-spiritual-600 font-outfit font-semibold uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-spiritual-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full pl-10 pr-4 py-3 bg-spiritual-50/50 border ${errors.name ? 'border-red-400' : 'border-spiritual-200'} rounded-xl text-sm font-poppins text-spiritual-800 placeholder-spiritual-400 focus:outline-none focus:border-spiritual-400 focus:ring-2 focus:ring-spiritual-200 transition-all`}
                  />
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-500 font-poppins">{errors.name}</p>}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs text-spiritual-600 font-outfit font-semibold uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-spiritual-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="youremail@example.com"
                  className={`w-full pl-10 pr-4 py-3 bg-spiritual-50/50 border ${errors.email ? 'border-red-400' : 'border-spiritual-200'} rounded-xl text-sm font-poppins text-spiritual-800 placeholder-spiritual-400 focus:outline-none focus:border-spiritual-400 focus:ring-2 focus:ring-spiritual-200 transition-all`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500 font-poppins">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-spiritual-600 font-outfit font-semibold uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-spiritual-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className={`w-full pl-10 pr-4 py-3 bg-spiritual-50/50 border ${errors.password ? 'border-red-400' : 'border-spiritual-200'} rounded-xl text-sm font-poppins text-spiritual-800 placeholder-spiritual-400 focus:outline-none focus:border-spiritual-400 focus:ring-2 focus:ring-spiritual-200 transition-all`}
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500 font-poppins">{errors.password}</p>}
            </div>

            {/* Confirm Password (Register only) */}
            {!isLogin && (
              <div className="animate-fade-in">
                <label className="block text-xs text-spiritual-600 font-outfit font-semibold uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-spiritual-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </span>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className={`w-full pl-10 pr-4 py-3 bg-spiritual-50/50 border ${errors.confirmPassword ? 'border-red-400' : 'border-spiritual-200'} rounded-xl text-sm font-poppins text-spiritual-800 placeholder-spiritual-400 focus:outline-none focus:border-spiritual-400 focus:ring-2 focus:ring-spiritual-200 transition-all`}
                  />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-500 font-poppins">{errors.confirmPassword}</p>}
              </div>
            )}

            {/* Remember / Forgot */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-spiritual-300 text-spiritual-500 focus:ring-spiritual-300" />
                  <span className="text-xs text-spiritual-500 font-poppins">Remember me</span>
                </label>
                <a href="#" className="text-xs text-spiritual-500 hover:text-gold-600 font-poppins transition-colors">
                  Forgot Password?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-spiritual-500 to-spiritual-600 text-white font-outfit font-semibold text-base rounded-xl shadow-lg shadow-spiritual-400/30 hover:shadow-spiritual-400/50 hover:from-spiritual-600 hover:to-spiritual-700 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden"
            >
              <span className="relative z-10">
                {isLogin ? 'Sign In' : '✨ Create Account'}
              </span>
              <div className="absolute inset-0 shimmer"></div>
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-spiritual-200"></div>
            <span className="text-xs text-spiritual-400 font-poppins">or continue with</span>
            <div className="flex-1 h-px bg-spiritual-200"></div>
          </div>

          {/* Social Login */}
          <div className="mt-4 flex gap-3">
            <button className="flex-1 py-2.5 bg-spiritual-50 border border-spiritual-200 rounded-xl text-sm font-poppins text-spiritual-600 hover:bg-spiritual-100 hover:border-spiritual-300 transition-all duration-300 flex items-center justify-center gap-2">
              <span className="text-lg">🔵</span> Google
            </button>
            <button className="flex-1 py-2.5 bg-spiritual-50 border border-spiritual-200 rounded-xl text-sm font-poppins text-spiritual-600 hover:bg-spiritual-100 hover:border-spiritual-300 transition-all duration-300 flex items-center justify-center gap-2">
              <span className="text-lg">📘</span> Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
