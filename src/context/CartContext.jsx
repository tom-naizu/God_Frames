import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { cartAPI } from '../services/api'
import { useAuth } from './AuthContext'

const CartContext = createContext()

const STORAGE_KEY = 'gods_frame_cart'

const getInitialCart = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return action.payload
    case 'ADD_TO_CART': {
      const existing = state.find((item) => item.id === action.payload.id)
      if (existing) {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...state, { ...action.payload, quantity: 1 }]
    }
    case 'REMOVE_FROM_CART':
      return state.filter((item) => item.id !== action.payload)
    case 'UPDATE_QUANTITY':
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      )
    case 'CLEAR_CART':
      return []
    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, [], getInitialCart)
  const { isAuthenticated } = useAuth()

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  // Sync with backend when authenticated
  const syncCartFromBackend = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      const res = await cartAPI.get()
      const backendItems = res.data.items.map((item) => ({
        id: item.product_detail.id,
        cartItemId: item.id,
        title: item.product_detail.title,
        category: item.product_detail.category_name,
        price: item.product_detail.formatted_price,
        originalPrice: item.product_detail.formatted_original_price,
        image: item.product_detail.image,
        badge: item.product_detail.badge,
        quantity: item.quantity,
      }))
      dispatch({ type: 'SET_CART', payload: backendItems })
    } catch {
      // Use local cart if backend fails
    }
  }, [isAuthenticated])

  useEffect(() => {
    syncCartFromBackend()
  }, [isAuthenticated, syncCartFromBackend])

  const addToCart = async (item) => {
    dispatch({ type: 'ADD_TO_CART', payload: item })
    if (isAuthenticated) {
      try {
        await cartAPI.add(item.id, 1)
        await syncCartFromBackend()
      } catch {
        // Local state already updated
      }
    }
  }

  const removeFromCart = async (id) => {
    const item = cartItems.find((i) => i.id === id)
    dispatch({ type: 'REMOVE_FROM_CART', payload: id })
    if (isAuthenticated && item?.cartItemId) {
      try {
        await cartAPI.remove(item.cartItemId)
      } catch {
        // Local state already updated
      }
    }
  }

  const updateQuantity = async (id, quantity) => {
    const item = cartItems.find((i) => i.id === id)
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
    if (isAuthenticated && item?.cartItemId) {
      try {
        await cartAPI.update(item.cartItemId, quantity)
      } catch {
        // Local state already updated
      }
    }
  }

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' })
    if (isAuthenticated) {
      try {
        await cartAPI.clear()
      } catch {
        // Local state already updated
      }
    }
  }

  const parsePrice = (priceStr) => {
    if (typeof priceStr === 'number') return priceStr
    return parseInt(String(priceStr).replace(/[₹,]/g, ''), 10) || 0
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + parsePrice(item.price) * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        syncCartFromBackend,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
