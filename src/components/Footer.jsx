import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer id="contact" className="relative overflow-hidden">
      {/* Top Decorative Border */}
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent"></div>

      {/* Main Footer */}
      <div className="bg-gradient-to-b from-spiritual-800 to-spiritual-900 text-white">
        {/* Texture overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* Brand Column */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <img src="/images/LOGO.jpg" alt="Gods_Frame Logo" className="w-10 h-10 rounded-full object-contain" />
                <div>
                  <h3 className="text-xl font-bold font-outfit">
                    <span className="text-gold-300">Gods</span>
                    <span className="text-gold-500">_</span>
                    <span className="text-gold-300">Frame</span>
                  </h3>
                  <p className="text-[10px] text-spiritual-300 tracking-[0.2em] uppercase">Divine Art Collection</p>
                </div>
              </div>
              <p className="text-sm text-spiritual-300 font-poppins font-light leading-relaxed">
                Bringing divine blessings to your home with premium quality spiritual frames. 
                Each piece is handcrafted with devotion and care.
              </p>
              {/* Social Icons */}
              <div className="mt-6 flex gap-3">
                {['📘', '📸', '🐦', '📺'].map((icon, i) => (
                  <button
                    key={i}
                    className="w-10 h-10 rounded-full bg-spiritual-700/50 hover:bg-gold-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-gold-400/20"
                  >
                    <span className="text-sm">{icon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-base font-outfit font-semibold text-gold-300 mb-5 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-gold-400 rounded-full"></span>
                Quick Links
              </h4>
              <ul className="space-y-3">
                {['Home', 'Shop All Frames', 'About Us', 'New Arrivals', 'Best Sellers'].map((link) => (
                  <li key={link}>
                    <a href="#" className="group flex items-center text-sm text-spiritual-300 hover:text-gold-300 font-poppins font-light transition-colors duration-300">
                      <svg className="w-3 h-3 mr-2 text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Store Info */}
            <div>
              <h4 className="text-base font-outfit font-semibold text-gold-300 mb-5 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-gold-400 rounded-full"></span>
                Our Store
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-spiritual-700/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-base">📍</span>
                  </div>
                  <div>
                    <p className="text-xs text-gold-400 font-outfit font-semibold uppercase tracking-wider">Store Address</p>
                    <p className="text-sm text-spiritual-300 font-poppins font-light mt-0.5">
                      Shop No. 12, Main Market Road,<br />
                      Near Temple Square, City - 110001
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-spiritual-700/50 flex items-center justify-center flex-shrink-0">
                    <span className="text-base">📞</span>
                  </div>
                  <div>
                    <p className="text-xs text-gold-400 font-outfit font-semibold uppercase tracking-wider">Contact Number</p>
                    <p className="text-sm text-spiritual-300 font-poppins font-light mt-0.5">
                      +91 98765 43210
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-spiritual-700/50 flex items-center justify-center flex-shrink-0">
                    <span className="text-base">✉️</span>
                  </div>
                  <div>
                    <p className="text-xs text-gold-400 font-outfit font-semibold uppercase tracking-wider">Email</p>
                    <p className="text-sm text-spiritual-300 font-poppins font-light mt-0.5">
                      contact@godsframe.com
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-base font-outfit font-semibold text-gold-300 mb-5 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-gold-400 rounded-full"></span>
                Stay Connected
              </h4>
              <p className="text-sm text-spiritual-300 font-poppins font-light mb-4">
                Subscribe for new arrivals, festive offers & divine collections.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2.5 bg-spiritual-700/50 border border-spiritual-600 rounded-l-xl text-sm text-white placeholder-spiritual-400 font-poppins focus:outline-none focus:border-gold-400 transition-colors"
                />
                <button className="px-4 py-2.5 bg-gradient-to-r from-gold-500 to-saffron-400 text-spiritual-900 font-outfit font-semibold text-sm rounded-r-xl hover:from-gold-400 hover:to-saffron-500 transition-all duration-300">
                  Subscribe
                </button>
              </div>
              <p className="mt-4 text-xs text-spiritual-400 font-poppins">
                🔒 We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-12 w-full h-px bg-gradient-to-r from-transparent via-spiritual-600 to-transparent"></div>

          {/* Bottom Bar */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-spiritual-400 font-poppins text-center sm:text-left">
              © 2026 Gods_Frame. All Rights Reserved. Made with ❤️ in India.
            </p>
            <div className="flex gap-6">
              {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map((link) => (
                <a key={link} href="#" className="text-xs text-spiritual-400 hover:text-gold-300 font-poppins transition-colors duration-300">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
