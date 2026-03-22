import { useState, useEffect, useRef } from 'react'

const features = [
  {
    icon: '🖼️',
    title: 'Premium Quality Glass Frames',
    description: 'Crystal-clear tempered glass with UV protection to keep your divine artwork vibrant for years.',
  },
  {
    icon: '🙌',
    title: 'Handcrafted with Love & Devotion',
    description: 'Each frame is carefully assembled by skilled artisans who pour their heart into every piece.',
  },
  {
    icon: '🎨',
    title: 'Vibrant HD Prints That Last Years',
    description: 'Ultra-high resolution prints using fade-resistant inks for colors that stay true forever.',
  },
  {
    icon: 'ॐ',
    title: 'Wide Variety of Hindu Deities',
    description: 'From Lord Ganesh to Maa Durga, Krishna to Shiva — find every deity for your pooja room.',
  },
  {
    icon: '📦',
    title: 'Secure Packaging & Fast Delivery',
    description: 'Multi-layer bubble wrap packaging ensures your frame arrives in perfect condition, every time.',
  },
  {
    icon: '💰',
    title: 'Affordable Prices for Everyone',
    description: 'Premium frames at prices that won\'t break the bank. Divine art accessible to all devotees.',
  },
]

const WhyChooseUs = () => {
  const [visibleItems, setVisibleItems] = useState(new Set())
  const itemRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.dataset.index)
            setVisibleItems((prev) => new Set([...prev, idx]))
          }
        })
      },
      { threshold: 0.2 }
    )

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-200/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-spiritual-200/30 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-6xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-gold-500 font-poppins text-sm font-semibold tracking-[0.3em] uppercase">
            ✦ Our Promise ✦
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold font-outfit">
            <span className="gradient-text">Why Choose</span>{' '}
            <span className="gradient-text-gold">Gods_Frame?</span>
          </h2>
          <div className="mt-4 mx-auto w-24 ornate-divider"></div>
          <p className="mt-6 text-spiritual-600 font-poppins font-light max-w-xl mx-auto">
            We don't just sell frames — we deliver divine experiences to your doorstep
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => (itemRefs.current[index] = el)}
              data-index={index}
              className={`group relative p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-spiritual-100 hover:border-gold-300 transition-all duration-700 card-hover ${
                visibleItems.has(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              {/* Green Checkmark + Icon */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="relative">
                    {/* Green check circle */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-400/30 group-hover:shadow-green-400/50 transition-shadow duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {/* Emoji overlay */}
                    <span className="absolute -top-1 -right-1 text-lg">{feature.icon}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-outfit font-semibold text-spiritual-800 group-hover:text-spiritual-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-spiritual-500 font-poppins font-light leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Hover border gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 via-gold-400 to-spiritual-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-2xl"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
