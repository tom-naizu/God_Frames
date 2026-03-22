import { useState, useEffect, useRef } from 'react'

const categories = [
  {
    name: 'God Frames',
    icon: 'ॐ',
    count: '120+ Designs',
    color: 'from-spiritual-400 to-spiritual-600',
    shadow: 'shadow-spiritual-400/30',
    description: 'Krishna, Ganesh, Durga, Shiva & more',
  },
  {
    name: 'Seven Horses',
    icon: '🐴',
    count: '40+ Designs',
    color: 'from-saffron-400 to-saffron-600',
    shadow: 'shadow-saffron-400/30',
    description: 'Vastu-approved running horses',
  },
  {
    name: 'Peacock Series',
    icon: '🦚',
    count: '35+ Designs',
    color: 'from-emerald-400 to-teal-600',
    shadow: 'shadow-emerald-400/30',
    description: 'Elegant peacock artwork collection',
  },
  {
    name: 'Nature Art',
    icon: '🌿',
    count: '50+ Designs',
    color: 'from-green-400 to-emerald-600',
    shadow: 'shadow-green-400/30',
    description: 'Trees, deer, and nature landscapes',
  },
  {
    name: 'Golden Deer',
    icon: '🦌',
    count: '25+ Designs',
    color: 'from-gold-400 to-gold-600',
    shadow: 'shadow-gold-400/30',
    description: 'Luxury golden deer artworks',
  },
  {
    name: 'Temple Art',
    icon: '🛕',
    count: '30+ Designs',
    color: 'from-amber-400 to-orange-600',
    shadow: 'shadow-amber-400/30',
    description: 'Sacred temple & gurudwara frames',
  },
]

const Categories = () => {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-spiritual-50/50 to-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-800 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="text-gold-500 font-poppins text-sm font-semibold tracking-[0.3em] uppercase">
            ✦ Browse By Category ✦
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold font-outfit">
            <span className="gradient-text">Shop by</span>{' '}
            <span className="gradient-text-gold">Category</span>
          </h2>
          <div className="mt-4 mx-auto w-24 ornate-divider"></div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat, index) => (
            <div
              key={cat.name}
              className={`group relative cursor-pointer transition-all duration-700 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              <div className="relative p-5 sm:p-6 bg-white rounded-2xl border border-spiritual-100 hover:border-transparent transition-all duration-300 card-hover text-center overflow-hidden">
                {/* Hover gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>

                {/* Icon */}
                <div className={`relative w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg ${cat.shadow} group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl sm:text-3xl">{cat.icon}</span>
                </div>

                {/* Title & Count */}
                <h3 className="mt-4 text-sm sm:text-base font-outfit font-semibold text-spiritual-800 group-hover:text-spiritual-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="mt-1 text-xs text-spiritual-400 font-poppins">{cat.count}</p>

                {/* Description (visible on hover) */}
                <p className="mt-2 text-xs text-spiritual-500 font-poppins leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-h-0 group-hover:max-h-20 overflow-hidden">
                  {cat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories
