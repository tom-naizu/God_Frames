import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login, register, googleLogin, sendOtp, verifyOtp, isAuthenticated, loading, error, setError } = useAuth()

  const [authMethod, setAuthMethod] = useState('email')
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', phone: '',
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [formErrors, setFormErrors] = useState({})

  // Phone OTP states
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpTimer, setOtpTimer] = useState(0)
  const [devOtp, setDevOtp] = useState(null)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    let interval
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((t) => t - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [otpTimer])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: '' })
    }
    setError(null)
  }

  const triggerSuccess = (msg) => {
    setSuccessMessage(msg)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormErrors({})
    try {
      if (isLogin) {
        await login(formData.email, formData.password)
        triggerSuccess('Login Successful! Welcome back ✨')
      } else {
        if (formData.password !== formData.confirmPassword) {
          setFormErrors({ confirmPassword: "Passwords don't match" })
          return
        }
        await register(formData.email, formData.password, formData.confirmPassword, formData.name)
        triggerSuccess('Account Created! Welcome to Gods_Frame ✨')
      }
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      // Error is set in AuthContext
    }
  }

  const handleGmailLogin = async () => {
    try {
      // In production, use Google Sign-In SDK to get token
      // For dev, we send a mock token
      const mockToken = 'dev_google_token_' + Date.now()
      await googleLogin(mockToken)
      triggerSuccess('Signed in with Google! Welcome ✨')
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      // Error handled
    }
  }

  const handleSendOtp = async () => {
    if (!formData.phone || formData.phone.length < 10) {
      setFormErrors({ phone: 'Enter a valid 10-digit phone number' })
      return
    }
    setFormErrors({})
    try {
      const res = await sendOtp(formData.phone)
      setOtpSent(true)
      setOtpTimer(30)
      setOtp(['', '', '', '', '', ''])
      if (res.dev_otp) {
        setDevOtp(res.dev_otp)
      }
    } catch (err) {
      // Error handled
    }
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`)
      if (next) next.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`)
      if (prev) prev.focus()
    }
  }

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('')
    if (enteredOtp.length < 6) {
      setFormErrors({ otp: 'Enter the complete 6-digit OTP' })
      return
    }
    try {
      await verifyOtp(formData.phone, enteredOtp)
      triggerSuccess('Phone Verified! Welcome to Gods_Frame ✨')
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      // Error handled
    }
  }

  const authMethods = [
    { key: 'email', label: 'Email', icon: '✉️' },
    { key: 'gmail', label: 'Google', icon: '🔵' },
    { key: 'phone', label: 'Phone', icon: '📱' },
  ]

  const renderInputField = (label, name, type, placeholder, icon) => (
    <div>
      <label className="block text-xs text-spiritual-600 font-outfit font-semibold uppercase tracking-wider mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-spiritual-400">{icon}</span>
        <input type={type} name={name} value={formData[name]} onChange={handleChange} placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-3 bg-spiritual-50/50 border ${formErrors[name] ? 'border-red-400' : 'border-spiritual-200'} rounded-xl text-sm font-poppins text-spiritual-800 placeholder-spiritual-400 focus:outline-none focus:border-spiritual-400 focus:ring-2 focus:ring-spiritual-200 transition-all`} />
      </div>
      {formErrors[name] && <p className="mt-1 text-xs text-red-500 font-poppins">{formErrors[name]}</p>}
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('/images/home-background.jpg')` }}>
        <div className="absolute inset-0 bg-gradient-to-br from-spiritual-900/80 via-spiritual-800/70 to-spiritual-900/80 backdrop-blur-sm"></div>
      </div>
      <div className="absolute top-20 left-20 w-64 h-64 bg-gold-400/10 rounded-full blur-[100px] animate-float"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-spiritual-400/10 rounded-full blur-[100px] animate-float delay-500"></div>

      {showSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-outfit font-semibold rounded-full shadow-2xl shadow-green-500/30 animate-fade-in-up flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          {successMessage}
        </div>
      )}

      <div className="relative w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-spiritual-200 hover:text-gold-300 font-poppins mb-6 transition-colors group">
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Home
        </Link>

        <div className="glass rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-spiritual-400 via-gold-400 to-saffron-400"></div>

          <div className="text-center mb-6">
            <img src="/images/LOGO.jpg" alt="Gods_Frame Logo" className="w-16 h-16 inline-block animate-float rounded-full object-contain mx-auto" />
            <h2 className="mt-3 text-2xl font-bold font-outfit gradient-text">
              {authMethod === 'gmail' ? 'Google Sign-In' : authMethod === 'phone' ? 'Phone Verification' : isLogin ? 'Welcome Back' : 'Join Gods_Frame'}
            </h2>
            <p className="mt-1 text-sm text-spiritual-500 font-poppins font-light">
              {authMethod === 'gmail' ? 'Sign in instantly with your Google account' : authMethod === 'phone' ? 'Verify your phone number to continue' : isLogin ? 'Sign in to continue your divine journey' : 'Create an account to start shopping'}
            </p>
          </div>

          {/* Global error */}
          {error && (
            <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-poppins">
              {error}
            </div>
          )}

          {/* Auth Method Selector */}
          <div className="flex bg-spiritual-100 rounded-xl p-1 mb-6 gap-1">
            {authMethods.map((method) => (
              <button key={method.key}
                onClick={() => { setAuthMethod(method.key); setFormErrors({}); setError(null); setOtpSent(false); setOtp(['', '', '', '', '', '']) }}
                className={`flex-1 py-2.5 text-xs font-outfit font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 ${authMethod === method.key ? 'bg-white text-spiritual-700 shadow-md' : 'text-spiritual-500 hover:text-spiritual-600'}`}>
                <span className="text-sm">{method.icon}</span>{method.label}
              </button>
            ))}
          </div>

          {/* EMAIL/PASSWORD AUTH */}
          {authMethod === 'email' && (
            <div className="animate-fade-in">
              <div className="flex bg-spiritual-100/60 rounded-xl p-1 mb-6">
                <button onClick={() => { setIsLogin(true); setFormErrors({}); setError(null) }}
                  className={`flex-1 py-2 text-sm font-outfit font-semibold rounded-lg transition-all duration-300 ${isLogin ? 'bg-white text-spiritual-700 shadow-md' : 'text-spiritual-500'}`}>Login</button>
                <button onClick={() => { setIsLogin(false); setFormErrors({}); setError(null) }}
                  className={`flex-1 py-2 text-sm font-outfit font-semibold rounded-lg transition-all duration-300 ${!isLogin ? 'bg-white text-spiritual-700 shadow-md' : 'text-spiritual-500'}`}>Register</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && renderInputField('Full Name', 'name', 'text', 'Enter your full name',
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>)}
                {renderInputField('Email Address', 'email', 'email', 'youremail@example.com',
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>)}
                {renderInputField('Password', 'password', 'password', 'Min 6 characters',
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>)}
                {!isLogin && renderInputField('Confirm Password', 'confirmPassword', 'password', 'Re-enter password',
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>)}

                <button type="submit" disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-spiritual-500 to-spiritual-600 text-white font-outfit font-semibold text-base rounded-xl shadow-lg shadow-spiritual-400/30 hover:shadow-spiritual-400/50 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden disabled:opacity-70">
                  <span className="relative z-10">{loading ? 'Please wait...' : isLogin ? 'Sign In' : '✨ Create Account'}</span>
                  <div className="absolute inset-0 shimmer"></div>
                </button>
              </form>
            </div>
          )}

          {/* GMAIL AUTH */}
          {authMethod === 'gmail' && (
            <div className="animate-fade-in space-y-5">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-white border-2 border-spiritual-100 flex items-center justify-center shadow-lg mb-4">
                  <svg className="w-10 h-10" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <p className="text-sm text-spiritual-500 font-poppins mb-6">Click below to sign in securely with your Google account</p>
              </div>
              <button onClick={handleGmailLogin} disabled={loading}
                className="w-full py-3.5 bg-white border-2 border-spiritual-200 text-spiritual-700 font-outfit font-semibold text-base rounded-xl shadow-md hover:shadow-lg hover:border-spiritual-300 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-3 disabled:opacity-70">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {loading ? 'Signing in...' : 'Continue with Google'}
              </button>
              <div className="p-3 bg-spiritual-50/60 rounded-xl border border-spiritual-100">
                <p className="text-xs text-spiritual-500 font-poppins leading-relaxed flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-spiritual-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Your Google account data is secure. We only access your name and email for sign-in purposes.
                </p>
              </div>
            </div>
          )}

          {/* PHONE AUTH */}
          {authMethod === 'phone' && (
            <div className="animate-fade-in space-y-5">
              {!otpSent ? (
                <>
                  <div>
                    <label className="block text-xs text-spiritual-600 font-outfit font-semibold uppercase tracking-wider mb-1.5">Phone Number</label>
                    <div className="flex gap-2">
                      <div className="flex items-center px-3 py-3 bg-spiritual-50/50 border border-spiritual-200 rounded-xl text-sm font-poppins text-spiritual-600">🇮🇳 +91</div>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter 10-digit number" maxLength={10}
                        className={`flex-1 px-4 py-3 bg-spiritual-50/50 border ${formErrors.phone ? 'border-red-400' : 'border-spiritual-200'} rounded-xl text-sm font-poppins text-spiritual-800 placeholder-spiritual-400 focus:outline-none focus:border-spiritual-400 focus:ring-2 focus:ring-spiritual-200 transition-all`} />
                    </div>
                    {formErrors.phone && <p className="mt-1 text-xs text-red-500 font-poppins">{formErrors.phone}</p>}
                  </div>
                  <button onClick={handleSendOtp} disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-spiritual-500 to-spiritual-600 text-white font-outfit font-semibold text-base rounded-xl shadow-lg shadow-spiritual-400/30 transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden flex items-center justify-center gap-2 disabled:opacity-70">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    {loading ? 'Sending...' : 'Send OTP'}
                    <div className="absolute inset-0 shimmer"></div>
                  </button>
                </>
              ) : (
                <>
                  <div className="text-center mb-2">
                    <div className="w-14 h-14 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-3">
                      <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <p className="text-sm text-spiritual-600 font-poppins">OTP sent to <span className="font-semibold text-spiritual-800">+91 {formData.phone}</span></p>
                    {devOtp && <p className="text-xs text-gold-600 font-poppins mt-1 bg-gold-50 px-3 py-1 rounded-lg inline-block">Dev OTP: <strong>{devOtp}</strong></p>}
                  </div>
                  <div>
                    <label className="block text-xs text-spiritual-600 font-outfit font-semibold uppercase tracking-wider mb-3 text-center">Enter 6-Digit OTP</label>
                    <div className="flex justify-center gap-2 sm:gap-3">
                      {otp.map((digit, index) => (
                        <input key={index} id={`otp-${index}`} type="text" inputMode="numeric" maxLength={1} value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className={`otp-input w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-outfit font-bold bg-spiritual-50/50 border-2 ${formErrors.otp ? 'border-red-400' : digit ? 'border-spiritual-400' : 'border-spiritual-200'} rounded-xl text-spiritual-800 focus:outline-none focus:border-spiritual-500 focus:ring-2 focus:ring-spiritual-200 transition-all`} />
                      ))}
                    </div>
                    {formErrors.otp && <p className="mt-2 text-xs text-red-500 font-poppins text-center">{formErrors.otp}</p>}
                  </div>
                  <div className="text-center">
                    {otpTimer > 0 ? (
                      <p className="text-xs text-spiritual-400 font-poppins">Resend OTP in <span className="font-semibold text-spiritual-600">{otpTimer}s</span></p>
                    ) : (
                      <button onClick={handleSendOtp} className="text-xs text-spiritual-500 hover:text-gold-600 font-poppins font-medium transition-colors underline">Resend OTP</button>
                    )}
                  </div>
                  <button onClick={handleVerifyOtp} disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-spiritual-500 to-spiritual-600 text-white font-outfit font-semibold text-base rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden flex items-center justify-center gap-2 disabled:opacity-70">
                    {loading ? 'Verifying...' : 'Verify OTP'}
                    <div className="absolute inset-0 shimmer"></div>
                  </button>
                  <button onClick={() => { setOtpSent(false); setFormErrors({}); setError(null) }}
                    className="w-full text-center text-xs text-spiritual-400 hover:text-spiritual-600 font-poppins transition-colors">← Change phone number</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginPage
