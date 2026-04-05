import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import Footer from '../components/Footer'

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart()
  const [removingId, setRemovingId] = useState(null)
  const navigate = useNavigate()

  const handleRemove = (id) => {
    setRemovingId(id)
    setTimeout(() => {
      removeFromCart(id)
      setRemovingId(null)
    }, 300)
  }

  const formatPrice = (num) => {
    return '₹' + num.toLocaleString('en-IN')
  }

  const deliveryCharge = cartTotal > 999 ? 0 : 99

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen texture-bg">
        <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            {/* Empty Cart Illustration */}
            <div className="relative w-40 h-40 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-spiritual-200 to-gold-200 rounded-full opacity-30 animate-float"></div>
              <div className="absolute inset-4 bg-white rounded-full shadow-lg flex items-center justify-center">
                <svg className="w-16 h-16 text-spiritual-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
              </div>
            </div>

            <h2 className="text-3xl font-bold font-outfit gradient-text mb-3">Your Cart is Empty</h2>
            <p className="text-spiritual-500 font-poppins font-light mb-8 max-w-md mx-auto">
              Looks like you haven't added any divine frames to your cart yet. Explore our collection and find the perfect piece for your sacred space.
            </p>

            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-spiritual-500 to-spiritual-600 text-white font-outfit font-semibold rounded-full shadow-lg shadow-spiritual-400/30 hover:shadow-spiritual-400/50 hover:from-spiritual-600 hover:to-spiritual-700 transition-all duration-300 hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen texture-bg">
      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-spiritual-500 hover:text-spiritual-700 font-poppins mb-4 transition-colors group">
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Continue Shopping
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold font-outfit">
              <span className="gradient-text">Shopping Cart</span>
            </h1>
            <p className="mt-2 text-spiritual-500 font-poppins font-light">
              {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className={`group bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 ${
                    removingId === item.id ? 'opacity-0 scale-95 -translate-x-8' : 'opacity-100'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div className="relative w-full sm:w-40 h-40 sm:h-auto flex-shrink-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {item.badge && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-gradient-to-r from-saffron-400 to-gold-500 text-white text-[10px] font-outfit font-semibold rounded-full">
                          {item.badge}
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <p className="text-xs text-gold-600 font-poppins font-medium tracking-wider uppercase">
                          {item.category}
                        </p>
                        <h3 className="mt-1 text-lg font-outfit font-semibold text-spiritual-800">
                          {item.title}
                        </h3>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-xl font-bold font-outfit gradient-text">{item.price}</span>
                          {item.originalPrice && (
                            <span className="text-sm text-spiritual-400 line-through font-poppins">{item.originalPrice}</span>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-9 h-9 rounded-lg bg-spiritual-50 border border-spiritual-200 flex items-center justify-center text-spiritual-600 hover:bg-spiritual-100 hover:border-spiritual-300 transition-all active:scale-95"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-10 text-center text-base font-outfit font-semibold text-spiritual-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-9 h-9 rounded-lg bg-spiritual-50 border border-spiritual-200 flex items-center justify-center text-spiritual-600 hover:bg-spiritual-100 hover:border-spiritual-300 transition-all active:scale-95"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="flex items-center gap-1.5 px-3 py-2 text-xs font-poppins text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={clearCart}
                  className="text-sm text-spiritual-400 hover:text-red-500 font-poppins transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Entire Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-6 sticky top-28">
                <h3 className="text-lg font-outfit font-bold text-spiritual-800 mb-5 flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-spiritual-400 to-gold-400 rounded-full"></div>
                  Order Summary
                </h3>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm font-poppins">
                    <span className="text-spiritual-500">Subtotal ({cartCount} items)</span>
                    <span className="text-spiritual-800 font-medium">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-poppins">
                    <span className="text-spiritual-500">Delivery</span>
                    <span className={`font-medium ${deliveryCharge === 0 ? 'text-green-600' : 'text-spiritual-800'}`}>
                      {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
                    </span>
                  </div>
                  {deliveryCharge > 0 && (
                    <p className="text-xs text-gold-600 font-poppins bg-gold-50 px-3 py-1.5 rounded-lg">
                      ✨ Add ₹{(1000 - cartTotal).toLocaleString('en-IN')} more for free delivery!
                    </p>
                  )}
                </div>

                <div className="border-t border-spiritual-100 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-base font-outfit font-bold text-spiritual-800">Total</span>
                    <span className="text-xl font-outfit font-bold gradient-text">
                      {formatPrice(cartTotal + deliveryCharge)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-3.5 bg-gradient-to-r from-spiritual-500 to-spiritual-600 text-white font-outfit font-semibold text-base rounded-xl shadow-lg shadow-spiritual-400/30 hover:shadow-spiritual-400/50 hover:from-spiritual-600 hover:to-spiritual-700 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden flex items-center justify-center gap-2"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Proceed to Checkout
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 shimmer"></div>
                </button>

                {/* Trust Badges */}
                <div className="mt-5 grid grid-cols-2 gap-2">
                  {[
                    { icon: '🔒', text: 'Secure Payment' },
                    { icon: '📦', text: 'Safe Packaging' },
                    { icon: '🔄', text: 'Easy Returns' },
                    { icon: '✅', text: 'Quality Assured' },
                  ].map((badge) => (
                    <div key={badge.text} className="flex items-center gap-1.5 text-xs text-spiritual-500 font-poppins">
                      <span className="text-sm">{badge.icon}</span>
                      {badge.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default CartPage
