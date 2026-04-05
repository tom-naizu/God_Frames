import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { orderAPI, paymentAPI } from '../services/api'
import Footer from '../components/Footer'

const CheckoutPage = () => {
  const { cartItems, cartTotal, cartCount, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '', phone: '', email: '', address1: '', address2: '',
    city: '', state: '', pincode: '', notes: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [errors, setErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderData, setOrderData] = useState(null)

  const deliveryCharge = cartTotal > 999 ? 0 : 99
  const grandTotal = cartTotal + deliveryCharge
  const formatPrice = (num) => '₹' + num.toLocaleString('en-IN')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const validateInfo = () => {
    const newErrors = {}
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    else if (formData.phone.length < 10) newErrors.phone = 'Enter valid 10-digit number'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email'
    if (!formData.address1.trim()) newErrors.address1 = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.pincode.trim()) newErrors.pincode = 'PIN code is required'
    else if (formData.pincode.length < 6) newErrors.pincode = 'Enter valid 6-digit PIN'
    return newErrors
  }

  const handleNext = () => {
    const newErrors = validateInfo()
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setIsProcessing(true)

    try {
      // Create order on backend
      const checkoutData = {
        full_name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address_line1: formData.address1,
        address_line2: formData.address2,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        notes: formData.notes,
        payment_method: paymentMethod,
      }

      const orderRes = await orderAPI.checkout(checkoutData)
      const order = orderRes.data.order
      setOrderData(order)

      if (paymentMethod === 'cod') {
        // COD - order placed directly
        clearCart()
        setStep(3)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        // Online payment - create Razorpay order
        try {
          const paymentRes = await paymentAPI.createOrder(order.id)
          const { razorpay_order_id, razorpay_key_id, amount, currency } = paymentRes.data

          const options = {
            key: razorpay_key_id,
            amount: amount,
            currency: currency,
            name: 'Gods_Frame',
            description: `Order #${order.id}`,
            order_id: razorpay_order_id,
            handler: async function (response) {
              // Verify payment
              try {
                await paymentAPI.verify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                })
                clearCart()
                setStep(3)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              } catch {
                alert('Payment verification failed. Please contact support.')
              }
            },
            prefill: {
              name: formData.fullName,
              email: formData.email,
              contact: `+91${formData.phone}`,
            },
            theme: {
              color: '#0b89f5',
            },
            modal: {
              ondismiss: function () {
                setIsProcessing(false)
              },
            },
          }

          if (window.Razorpay) {
            const razorpay = new window.Razorpay(options)
            razorpay.open()
          } else {
            // Razorpay script not loaded - fallback to COD
            alert('Payment gateway is loading. Please try again or choose Cash on Delivery.')
          }
        } catch (err) {
          alert('Could not initiate payment. Order has been saved. Please try again from your orders.')
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to place order. Please try again.'
      alert(errorMsg)
    } finally {
      setIsProcessing(false)
    }
  }

  const steps = [
    { num: 1, label: 'Delivery Info' },
    { num: 2, label: 'Payment' },
    { num: 3, label: 'Confirmation' },
  ]

  const paymentMethods = [
    { key: 'cod', label: 'Cash on Delivery', icon: '💵', description: 'Pay when your order arrives' },
    { key: 'upi', label: 'UPI Payment', icon: '📱', description: 'GPay, PhonePe, Paytm — via Razorpay' },
    { key: 'card', label: 'Credit / Debit Card', icon: '💳', description: 'Visa, Mastercard, RuPay — via Razorpay' },
  ]

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir',
  ]

  if (cartItems.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen texture-bg pt-28 pb-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold font-outfit gradient-text mb-3">No items to checkout</h2>
          <p className="text-spiritual-500 font-poppins font-light mb-6">Add some frames to your cart first.</p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-spiritual-500 to-spiritual-600 text-white font-outfit font-semibold rounded-full shadow-lg">Browse Collection</Link>
        </div>
      </div>
    )
  }

  if (!isAuthenticated && step !== 3) {
    return (
      <div className="min-h-screen texture-bg pt-28 pb-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold font-outfit gradient-text mb-3">Login Required</h2>
          <p className="text-spiritual-500 font-poppins font-light mb-6">Please login to proceed with checkout.</p>
          <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-spiritual-500 to-spiritual-600 text-white font-outfit font-semibold rounded-full shadow-lg">Login to Continue</Link>
        </div>
      </div>
    )
  }

  const renderInput = (label, name, type = 'text', placeholder = '', options = {}) => (
    <div className={options.className || ''}>
      <label className="block text-xs text-spiritual-600 font-outfit font-semibold uppercase tracking-wider mb-1.5">
        {label} {options.optional && <span className="text-spiritual-300 normal-case">(optional)</span>}
      </label>
      {type === 'select' ? (
        <select name={name} value={formData[name]} onChange={handleChange}
          className={`w-full px-4 py-3 bg-spiritual-50/50 border ${errors[name] ? 'border-red-400' : 'border-spiritual-200'} rounded-xl text-sm font-poppins text-spiritual-800 focus:outline-none focus:border-spiritual-400 focus:ring-2 focus:ring-spiritual-200 transition-all appearance-none`}>
          <option value="">{placeholder}</option>
          {options.choices?.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea name={name} value={formData[name]} onChange={handleChange} placeholder={placeholder} rows={3}
          className="w-full px-4 py-3 bg-spiritual-50/50 border border-spiritual-200 rounded-xl text-sm font-poppins text-spiritual-800 placeholder-spiritual-400 focus:outline-none focus:border-spiritual-400 focus:ring-2 focus:ring-spiritual-200 transition-all resize-none" />
      ) : (
        <input type={type} name={name} value={formData[name]} onChange={handleChange} placeholder={placeholder} maxLength={options.maxLength}
          className={`w-full px-4 py-3 bg-spiritual-50/50 border ${errors[name] ? 'border-red-400' : 'border-spiritual-200'} rounded-xl text-sm font-poppins text-spiritual-800 placeholder-spiritual-400 focus:outline-none focus:border-spiritual-400 focus:ring-2 focus:ring-spiritual-200 transition-all`} />
      )}
      {errors[name] && <p className="mt-1 text-xs text-red-500 font-poppins">{errors[name]}</p>}
    </div>
  )

  return (
    <div className="min-h-screen texture-bg">
      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {step !== 3 && (
            <div className="mb-8">
              <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-spiritual-500 hover:text-spiritual-700 font-poppins mb-4 transition-colors group">
                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Back to Cart
              </Link>
              <h1 className="text-3xl sm:text-4xl font-bold font-outfit"><span className="gradient-text">Checkout</span></h1>
            </div>
          )}

          {/* Step Indicator */}
          <div className="mb-10">
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              {steps.map((s, i) => (
                <div key={s.num} className="flex items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-outfit font-bold transition-all duration-500 ${step >= s.num ? 'bg-gradient-to-r from-spiritual-500 to-spiritual-600 text-white shadow-lg shadow-spiritual-400/30' : 'bg-spiritual-100 text-spiritual-400'}`}>
                      {step > s.num ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> : s.num}
                    </div>
                    <span className={`hidden sm:block text-sm font-outfit font-medium ${step >= s.num ? 'text-spiritual-700' : 'text-spiritual-400'}`}>{s.label}</span>
                  </div>
                  {i < steps.length - 1 && <div className={`w-12 sm:w-20 h-0.5 rounded-full transition-all duration-500 ${step > s.num ? 'bg-gradient-to-r from-spiritual-400 to-gold-400' : 'bg-spiritual-200'}`}></div>}
                </div>
              ))}
            </div>
          </div>

          {/* STEP 3: SUCCESS */}
          {step === 3 && (
            <div className="max-w-xl mx-auto text-center animate-fade-in py-10">
              <div className="relative w-28 h-28 mx-auto mb-6">
                <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl shadow-green-400/30">
                  <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold font-outfit gradient-text mb-3">Order Placed Successfully! 🎉</h2>
              <p className="text-spiritual-500 font-poppins font-light mb-2">Your divine frames will be shipped within 5-7 business days.</p>
              {orderData && <p className="text-sm text-gold-600 font-outfit font-semibold mb-8">Order ID: #{orderData.id}</p>}
              <div className="bg-white rounded-2xl shadow-md p-6 mb-8 text-left">
                <h3 className="text-sm font-outfit font-semibold text-spiritual-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <div className="w-6 h-0.5 bg-gold-400 rounded-full"></div>Delivery Details
                </h3>
                <div className="space-y-2 text-sm font-poppins">
                  <p className="text-spiritual-800 font-medium">{formData.fullName}</p>
                  <p className="text-spiritual-500">{formData.address1}</p>
                  {formData.address2 && <p className="text-spiritual-500">{formData.address2}</p>}
                  <p className="text-spiritual-500">{formData.city}, {formData.state} - {formData.pincode}</p>
                  <p className="text-spiritual-500">📞 +91 {formData.phone}</p>
                </div>
              </div>
              <Link to="/" className="px-8 py-3 bg-gradient-to-r from-spiritual-500 to-spiritual-600 text-white font-outfit font-semibold rounded-full shadow-lg shadow-spiritual-400/30 hover:shadow-spiritual-400/50 transition-all duration-300 hover:-translate-y-0.5">
                Continue Shopping
              </Link>
            </div>
          )}

          {/* STEPS 1 & 2 */}
          {step !== 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {step === 1 && (
                  <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 animate-fade-in">
                    <h2 className="text-xl font-outfit font-bold text-spiritual-800 mb-6 flex items-center gap-2">
                      <div className="w-8 h-0.5 bg-gradient-to-r from-spiritual-400 to-gold-400 rounded-full"></div>Delivery Information
                    </h2>
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {renderInput('Full Name', 'fullName', 'text', 'Enter your full name')}
                        {renderInput('Phone Number', 'phone', 'tel', '10-digit phone number', { maxLength: 10 })}
                      </div>
                      {renderInput('Email Address', 'email', 'email', 'youremail@example.com')}
                      {renderInput('Address Line 1', 'address1', 'text', 'House no., Building, Street')}
                      {renderInput('Address Line 2', 'address2', 'text', 'Landmark, Area (optional)', { optional: true })}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {renderInput('City', 'city', 'text', 'Your city')}
                        {renderInput('State', 'state', 'select', 'Select state', { choices: indianStates })}
                        {renderInput('PIN Code', 'pincode', 'text', '6-digit PIN', { maxLength: 6 })}
                      </div>
                      {renderInput('Delivery Notes', 'notes', 'textarea', 'Any special instructions...', { optional: true })}
                      <button onClick={handleNext}
                        className="w-full sm:w-auto px-10 py-3.5 bg-gradient-to-r from-spiritual-500 to-spiritual-600 text-white font-outfit font-semibold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2">
                        Continue to Payment
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-md p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-outfit font-semibold text-spiritual-800 uppercase tracking-wider flex items-center gap-2">
                          <div className="w-6 h-0.5 bg-gold-400 rounded-full"></div>Delivering To
                        </h3>
                        <button onClick={() => setStep(1)} className="text-xs text-spiritual-500 hover:text-spiritual-700 font-poppins underline">Change</button>
                      </div>
                      <div className="text-sm font-poppins space-y-1">
                        <p className="text-spiritual-800 font-medium">{formData.fullName}</p>
                        <p className="text-spiritual-500">{formData.address1}{formData.address2 ? `, ${formData.address2}` : ''}</p>
                        <p className="text-spiritual-500">{formData.city}, {formData.state} - {formData.pincode}</p>
                        <p className="text-spiritual-500">📞 +91 {formData.phone}</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-6">
                      <h3 className="text-sm font-outfit font-semibold text-spiritual-800 uppercase tracking-wider mb-5 flex items-center gap-2">
                        <div className="w-6 h-0.5 bg-gold-400 rounded-full"></div>Payment Method
                      </h3>
                      <div className="space-y-3">
                        {paymentMethods.map((method) => (
                          <button key={method.key} onClick={() => setPaymentMethod(method.key)}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 text-left ${paymentMethod === method.key ? 'border-spiritual-400 bg-spiritual-50/50 shadow-md' : 'border-spiritual-100 hover:border-spiritual-200'}`}>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${paymentMethod === method.key ? 'bg-gradient-to-br from-spiritual-400 to-spiritual-500 shadow-lg' : 'bg-spiritual-100'}`}>{method.icon}</div>
                            <div className="flex-1">
                              <p className="text-sm font-outfit font-semibold text-spiritual-800">{method.label}</p>
                              <p className="text-xs text-spiritual-400 font-poppins">{method.description}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.key ? 'border-spiritual-500' : 'border-spiritual-300'}`}>
                              {paymentMethod === method.key && <div className="w-3 h-3 rounded-full bg-gradient-to-r from-spiritual-500 to-spiritual-600"></div>}
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <button onClick={() => setStep(1)} className="px-6 py-3 border-2 border-spiritual-200 text-spiritual-600 font-outfit font-semibold rounded-xl hover:bg-spiritual-50 transition-all">← Back</button>
                        <button onClick={handlePlaceOrder} disabled={isProcessing}
                          className="flex-1 py-3.5 bg-gradient-to-r from-spiritual-500 to-spiritual-600 text-white font-outfit font-semibold rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                          {isProcessing ? (
                            <><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Processing...</>
                          ) : (
                            <>Place Order — {formatPrice(grandTotal)}<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></>
                          )}
                          <div className="absolute inset-0 shimmer"></div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-md p-6 sticky top-28">
                  <h3 className="text-sm font-outfit font-semibold text-spiritual-800 uppercase tracking-wider mb-5 flex items-center gap-2">
                    <div className="w-6 h-0.5 bg-gold-400 rounded-full"></div>Order Summary
                  </h3>
                  <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-outfit font-medium text-spiritual-800 truncate">{item.title}</p>
                          <p className="text-xs text-spiritual-400 font-poppins">Qty: {item.quantity}</p>
                          <p className="text-sm font-outfit font-bold gradient-text">{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-spiritual-100 pt-4 space-y-2">
                    <div className="flex justify-between text-sm font-poppins">
                      <span className="text-spiritual-500">Subtotal</span>
                      <span className="text-spiritual-800 font-medium">{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-poppins">
                      <span className="text-spiritual-500">Delivery</span>
                      <span className={deliveryCharge === 0 ? 'text-green-600 font-medium' : 'text-spiritual-800 font-medium'}>
                        {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-spiritual-100 pt-4 mt-3">
                    <div className="flex justify-between">
                      <span className="text-base font-outfit font-bold text-spiritual-800">Total</span>
                      <span className="text-xl font-outfit font-bold gradient-text">{formatPrice(grandTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default CheckoutPage
