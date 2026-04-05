import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { cartCount } = useCart()
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setShowUserMenu(false)
  }, [location])

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/#shop' },
    { name: 'About', path: '/#about' },
    { name: 'Contact', path: '/#contact' },
  ]

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    navigate('/')
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass shadow-lg shadow-spiritual-200/50 py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src="/images/LOGO.jpg"
                alt="Gods_Frame Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-contain filter drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute -inset-2 bg-gold-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-outfit tracking-wide">
                <span className="gradient-text">Gods</span>
                <span className="text-gold-500">_</span>
                <span className="gradient-text">Frame</span>
              </h1>
              <p className="text-[10px] sm:text-xs text-spiritual-600 font-light tracking-[0.2em] uppercase">
                Divine Art Collection
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-medium font-outfit tracking-wide rounded-lg transition-all duration-300 group
                  ${location.pathname === link.path
                    ? 'text-spiritual-700'
                    : 'text-spiritual-800/70 hover:text-spiritual-700'
                  }`}
              >
                {link.name}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-spiritual-400 to-gold-400 rounded-full transition-all duration-300
                    ${location.pathname === link.path ? 'w-3/4' : 'w-0 group-hover:w-3/4'}
                  `}
                ></span>
              </Link>
            ))}

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative ml-2 p-2.5 rounded-xl hover:bg-spiritual-100/50 transition-all duration-300 group"
              id="cart-icon-desktop"
            >
              <svg className="w-6 h-6 text-spiritual-700 group-hover:text-spiritual-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-saffron-400 to-gold-500 text-white text-[10px] font-outfit font-bold rounded-full flex items-center justify-center shadow-md animate-scale-in">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative ml-2">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-spiritual-500/10 to-gold-400/10 rounded-full border border-spiritual-200 hover:border-spiritual-300 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-spiritual-500 to-spiritual-600 flex items-center justify-center text-white text-xs font-bold font-outfit">
                    {(user?.full_name || user?.email || 'U')[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-outfit font-medium text-spiritual-700 max-w-[100px] truncate">
                    {user?.full_name || user?.email?.split('@')[0] || 'User'}
                  </span>
                  <svg className={`w-4 h-4 text-spiritual-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-spiritual-100 py-2 animate-fade-in z-50">
                    <div className="px-4 py-2 border-b border-spiritual-100">
                      <p className="text-xs text-spiritual-400 font-poppins">Signed in as</p>
                      <p className="text-sm text-spiritual-700 font-outfit font-medium truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-poppins transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-2 px-6 py-2.5 bg-gradient-to-r from-spiritual-500 to-spiritual-600 text-white text-sm font-semibold font-outfit rounded-full shadow-lg shadow-spiritual-400/30 hover:shadow-spiritual-400/50 hover:from-spiritual-600 hover:to-spiritual-700 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Right Section */}
          <div className="md:hidden flex items-center gap-2">
            <Link to="/cart" className="relative p-2 rounded-lg hover:bg-spiritual-100 transition-colors">
              <svg className="w-6 h-6 text-spiritual-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-saffron-400 to-gold-500 text-white text-[10px] font-outfit font-bold rounded-full flex items-center justify-center shadow-md">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-spiritual-100 transition-colors"
              id="mobile-menu-button"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-spiritual-700 rounded-full transition-all duration-300 transform origin-center ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`w-full h-0.5 bg-spiritual-700 rounded-full transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-0' : ''}`}></span>
                <span className={`w-full h-0.5 bg-spiritual-700 rounded-full transition-all duration-300 transform origin-center ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ${mobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
          <div className="glass rounded-2xl p-4 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-spiritual-700 font-outfit font-medium rounded-xl hover:bg-spiritual-100 transition-colors">
                {link.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 border-t border-spiritual-200 mt-2 pt-3">
                  <p className="text-xs text-spiritual-400 font-poppins">Signed in as</p>
                  <p className="text-sm text-spiritual-700 font-outfit font-medium">{user?.full_name || user?.email}</p>
                </div>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false) }}
                  className="block w-full text-left px-4 py-3 text-red-500 font-outfit font-medium rounded-xl hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 mt-2 text-center bg-gradient-to-r from-spiritual-500 to-spiritual-600 text-white font-outfit font-semibold rounded-xl">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
