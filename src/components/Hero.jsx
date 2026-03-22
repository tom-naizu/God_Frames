import { useState, useEffect } from 'react'

const Hero = () => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/home-background.jpg')`,
        }}
      >
        {/* Opacity Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-spiritual-50/60 via-white/40 to-spiritual-50/70"></div>
        {/* Texture Overlay */}
        <div className="absolute inset-0 texture-bg opacity-30"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gold-300/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-spiritual-300/20 rounded-full blur-3xl animate-float delay-700"></div>
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-saffron-400/10 rounded-full blur-2xl animate-float delay-300"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Om Symbol */}
        <div
          className={`transition-all duration-1000 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <img
            src="/images/LOGO.jpg"
            alt="Gods_Frame Logo"
            className="w-20 h-20 sm:w-24 sm:h-24 inline-block animate-float filter drop-shadow-2xl rounded-full object-contain"
          />
        </div>

        {/* Heading */}
        <h1
          className={`mt-6 text-4xl sm:text-5xl md:text-7xl font-bold font-outfit leading-tight transition-all duration-1000 delay-200 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="gradient-text">Divine Frames</span>
          <br />
          <span className="text-spiritual-800 text-3xl sm:text-4xl md:text-5xl font-light">
            for Your{' '}
          </span>
          <span className="gradient-text-gold text-3xl sm:text-4xl md:text-5xl font-semibold">
            Sacred Space
          </span>
        </h1>

        {/* Ornate Divider */}
        <div
          className={`my-6 mx-auto w-48 ornate-divider transition-all duration-1000 delay-400 ${
            loaded ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          }`}
        ></div>

        {/* Subtitle */}
        <p
          className={`text-spiritual-700/80 text-base sm:text-lg md:text-xl font-poppins font-light max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Discover premium Hindu spiritual frames handcrafted with devotion.
          From Lord Krishna to Maa Durga — bring divine blessings to your home.
        </p>

        {/* CTA Buttons */}
        <div
          className={`mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-700 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <a
            href="#shop"
            className="group relative px-8 py-4 bg-gradient-to-r from-spiritual-500 to-spiritual-600 text-white font-outfit font-semibold text-lg rounded-full shadow-xl shadow-spiritual-400/30 hover:shadow-spiritual-400/50 transition-all duration-300 hover:-translate-y-1 active:translate-y-0 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore Collection
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
            <div className="absolute inset-0 shimmer"></div>
          </a>

          <a
            href="#about"
            className="px-8 py-4 border-2 border-gold-400 text-spiritual-700 font-outfit font-semibold text-lg rounded-full hover:bg-gold-50 hover:border-gold-500 transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
          >
            ✨ Why Choose Us
          </a>
        </div>

        {/* Stats */}
        <div
          className={`mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto transition-all duration-1000 delay-[900ms] ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {[
            { number: '500+', label: 'Frames' },
            { number: '10K+', label: 'Happy Customers' },
            { number: '50+', label: 'Designs' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold font-outfit text-spiritual-900" style={{ textShadow: '0 1px 4px rgba(255,255,255,0.8)' }}>{stat.number}</p>
              <p className="text-xs sm:text-sm text-spiritual-800 font-poppins font-medium mt-1" style={{ textShadow: '0 1px 3px rgba(255,255,255,0.7)' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-spiritual-400 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-spiritual-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}

export default Hero
