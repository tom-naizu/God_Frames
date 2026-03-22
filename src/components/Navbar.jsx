import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/#shop' },
    { name: 'About', path: '/#about' },
    { name: 'Contact', path: '/#contact' },
  ]

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

            {/* Login Button */}
            <Link
              to="/login"
              className="ml-4 px-6 py-2.5 bg-gradient-to-r from-spiritual-500 to-spiritual-600 text-white text-sm font-semibold font-outfit rounded-full shadow-lg shadow-spiritual-400/30 hover:shadow-spiritual-400/50 hover:from-spiritual-600 hover:to-spiritual-700 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-spiritual-100 transition-colors"
            id="mobile-menu-button"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span
                className={`w-full h-0.5 bg-spiritual-700 rounded-full transition-all duration-300 transform origin-center ${
                  mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              ></span>
              <span
                className={`w-full h-0.5 bg-spiritual-700 rounded-full transition-all duration-300 ${
                  mobileMenuOpen ? 'opacity-0 scale-0' : ''
                }`}
              ></span>
              <span
                className={`w-full h-0.5 bg-spiritual-700 rounded-full transition-all duration-300 transform origin-center ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ${
            mobileMenuOpen ? 'max-h-80 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="glass rounded-2xl p-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-spiritual-700 font-outfit font-medium rounded-xl hover:bg-spiritual-100 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 mt-2 text-center bg-gradient-to-r from-spiritual-500 to-spiritual-600 text-white font-outfit font-semibold rounded-xl"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
