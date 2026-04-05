import { useState, useEffect, useRef } from 'react'
import { useCart } from '../context/CartContext'
import { productAPI } from '../services/api'

const fallbackFrames = [
  { id: 1, title: 'Golden Deer Triptych', category: 'Nature Art', price: '₹2,499', originalPrice: '₹3,999', image: '/images/secondry-image/ChatGPT Image Mar 21, 2026, 06_06_43 PM.png', badge: 'Bestseller' },
  { id: 2, title: 'Radha Krishna & Sacred Collection', category: 'God Frames', price: '₹1,899', originalPrice: '₹2,999', image: '/images/secondry-image/ChatGPT Image Mar 21, 2026, 06_07_35 PM.png', badge: 'Popular' },
  { id: 3, title: 'Seven Horses Sunrise', category: 'Vastu Frames', price: '₹2,199', originalPrice: '₹3,499', image: '/images/secondry-image/ChatGPT Image Mar 21, 2026, 06_07_41 PM.png', badge: 'Vastu Special' },
  { id: 4, title: 'Divine Deity Collection', category: 'God Frames', price: '₹1,599', originalPrice: '₹2,499', image: '/images/secondry-image/ChatGPT Image Mar 21, 2026, 06_07_44 PM.png', badge: null },
  { id: 5, title: 'White Peacock Elegance', category: 'Peacock Series', price: '₹2,799', originalPrice: '₹4,499', image: '/images/secondry-image/ChatGPT Image Mar 21, 2026, 06_07_48 PM.png', badge: 'Premium' },
  { id: 6, title: 'Royal Peacock Paradise', category: 'Peacock Series', price: '₹2,599', originalPrice: '₹3,999', image: '/images/secondry-image/ChatGPT Image Mar 21, 2026, 06_07_50 PM.png', badge: 'New Arrival' },
  { id: 7, title: 'Ganesh & Krishna Divine Set', category: 'God Frames', price: '₹1,999', originalPrice: '₹3,199', image: '/images/secondry-image/ChatGPT Image Mar 21, 2026, 06_08_02 PM.png', badge: null },
  { id: 8, title: 'Maa Durga Navratri Special', category: 'God Frames', price: '₹2,299', originalPrice: '₹3,699', image: '/images/secondry-image/ChatGPT Image Mar 21, 2026, 06_08_07 PM.png', badge: 'Festive Special' },
]

const FeaturedFrames = () => {
  const [frames, setFrames] = useState(fallbackFrames)
  const [visibleCards, setVisibleCards] = useState(new Set())
  const [filter, setFilter] = useState('All')
  const [addedId, setAddedId] = useState(null)
  const cardRefs = useRef([])
  const { addToCart } = useCart()

  const categories = ['All', 'God Frames', 'Nature Art', 'Peacock Series', 'Vastu Frames']

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productAPI.getAll()
        const products = (res.data.results || res.data).map((p) => ({
          id: p.id,
          title: p.title,
          category: p.category_name,
          price: p.formatted_price,
          originalPrice: p.formatted_original_price,
          image: p.image,
          badge: p.badge,
        }))
        if (products.length > 0) setFrames(products)
      } catch {
        // Use fallback data
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.dataset.index)
            setVisibleCards((prev) => new Set([...prev, idx]))
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [filter, frames])

  const filteredFrames = filter === 'All' ? frames : frames.filter((f) => f.category === filter)

  const handleAddToCart = (frame) => {
    addToCart(frame)
    setAddedId(frame.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  return (
    <section id="shop" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <span className="text-gold-500 font-poppins text-sm font-semibold tracking-[0.3em] uppercase">
          ✦ Our Collection ✦
        </span>
        <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold font-outfit">
          <span className="gradient-text">Featured Frames</span>
        </h2>
        <div className="mt-4 mx-auto w-24 ornate-divider"></div>
        <p className="mt-6 text-spiritual-600 font-poppins font-light max-w-2xl mx-auto">
          Handpicked divine artwork to bring spiritual energy and beauty to every corner of your home
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {categories.map((cat) => (
            <button key={cat}
              onClick={() => { setFilter(cat); setVisibleCards(new Set()) }}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-outfit font-medium transition-all duration-300 ${
                filter === cat
                  ? 'bg-gradient-to-r from-spiritual-500 to-spiritual-600 text-white shadow-lg shadow-spiritual-400/30'
                  : 'bg-white/80 text-spiritual-600 border border-spiritual-200 hover:border-spiritual-400 hover:bg-spiritual-50'
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {filteredFrames.map((frame, index) => (
          <div key={frame.id}
            ref={(el) => (cardRefs.current[index] = el)}
            data-index={index}
            className={`group relative bg-white rounded-2xl overflow-hidden shadow-md card-hover transition-all duration-700 ${
              visibleCards.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}>

            {frame.badge && (
              <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-gradient-to-r from-saffron-400 to-gold-500 text-white text-xs font-outfit font-semibold rounded-full shadow-md">
                {frame.badge}
              </div>
            )}

            <button className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-spiritual-400 hover:text-red-500 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            <div className="relative overflow-hidden aspect-[4/3]">
              <img src={frame.image} alt={frame.title} loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button className="px-5 py-2.5 bg-white/90 backdrop-blur-sm text-spiritual-700 font-outfit font-semibold text-sm rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-white">
                  Quick View
                </button>
              </div>
            </div>

            <div className="p-5">
              <p className="text-xs text-gold-600 font-poppins font-medium tracking-wider uppercase">{frame.category}</p>
              <h3 className="mt-1.5 text-base font-outfit font-semibold text-spiritual-800 group-hover:text-spiritual-600 transition-colors line-clamp-1">{frame.title}</h3>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold font-outfit gradient-text">{frame.price}</span>
                  {frame.originalPrice && <span className="text-sm text-spiritual-400 line-through font-poppins">{frame.originalPrice}</span>}
                </div>
              </div>
              <button onClick={() => handleAddToCart(frame)}
                className={`mt-4 w-full py-2.5 font-outfit font-medium text-sm rounded-xl shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 ${
                  addedId === frame.id
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-400/30'
                    : 'bg-gradient-to-r from-spiritual-500 to-spiritual-600 text-white shadow-spiritual-400/20 hover:shadow-spiritual-400/40'
                }`}>
                {addedId === frame.id ? (
                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Added!</>
                ) : (
                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>Add to Cart</>
                )}
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-spiritual-400 via-gold-400 to-saffron-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeaturedFrames
