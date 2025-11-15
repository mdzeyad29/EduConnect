import { createSlice } from "@reduxjs/toolkit"
import { toast } from "react-hot-toast"

// Helper function to get user-specific cart key
const getCartKey = (userId) => `cart_${userId || 'guest'}`
const getTotalKey = (userId) => `total_${userId || 'guest'}`
const getTotalItemsKey = (userId) => `totalItems_${userId || 'guest'}`

// Get current user ID from localStorage
const getCurrentUserId = () => {
  try {
    const user = localStorage.getItem("user")
    if (!user) return null
    const parsedUser = JSON.parse(user)
    // Try different possible ID fields and convert to string
    const userId = parsedUser?._id || parsedUser?.id || null
    return userId ? String(userId) : null
  } catch {
    return null
  }
}

// Migrate old cart data to user-specific keys
const migrateOldCart = (userId) => {
  if (!userId) return
  
  try {
    const userIdString = String(userId)
    // Check if old cart exists
    const oldCart = localStorage.getItem("cart")
    const oldTotal = localStorage.getItem("total")
    const oldTotalItems = localStorage.getItem("totalItems")
    
    // Check if user-specific cart already exists
    const userCartExists = localStorage.getItem(getCartKey(userIdString))
    
    // If old cart exists and user-specific cart doesn't, migrate it
    if (oldCart && !userCartExists) {
      localStorage.setItem(getCartKey(userIdString), oldCart)
      if (oldTotal) localStorage.setItem(getTotalKey(userIdString), oldTotal)
      if (oldTotalItems) localStorage.setItem(getTotalItemsKey(userIdString), oldTotalItems)
      
      // Optionally remove old cart after migration
      // localStorage.removeItem("cart")
      // localStorage.removeItem("total")
      // localStorage.removeItem("totalItems")
    }
  } catch (error) {
    console.error("Error migrating cart:", error)
  }
}

const currentUserId = getCurrentUserId()

// Migrate old cart if user is logged in
if (currentUserId) {
  migrateOldCart(currentUserId)
}

const initialState = {
  cart: currentUserId && localStorage.getItem(getCartKey(currentUserId))
    ? JSON.parse(localStorage.getItem(getCartKey(currentUserId)))
    : [],
  total: currentUserId && localStorage.getItem(getTotalKey(currentUserId))
    ? JSON.parse(localStorage.getItem(getTotalKey(currentUserId)))
    : 0,
  totalItems: currentUserId && localStorage.getItem(getTotalItemsKey(currentUserId))
    ? JSON.parse(localStorage.getItem(getTotalItemsKey(currentUserId)))
    : 0,
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const course = action.payload
      const userId = getCurrentUserId()
      
      if (!userId) {
        toast.error("Please login to add courses to cart")
        return
      }
      
      // Ensure userId is a string
      const userIdString = String(userId)

      const index = state.cart.findIndex((item) => item._id === course._id)

      if (index >= 0) {
        // If the course is already in the cart, do not modify the quantity
        toast.error("Course already in cart")
        return
      }
      // If the course is not in the cart, add it to the cart
      state.cart.push(course)
      // Update the total quantity and price
      state.totalItems++
      state.total += course.price
      // Update to localstorage with user-specific keys
      localStorage.setItem(getCartKey(userIdString), JSON.stringify(state.cart))
      localStorage.setItem(getTotalKey(userIdString), JSON.stringify(state.total))
      localStorage.setItem(getTotalItemsKey(userIdString), JSON.stringify(state.totalItems))
      // show toast
      toast.success("Course added to cart")
    },
    removeFromCart: (state, action) => {
      const courseId = action.payload
      const userId = getCurrentUserId()
      const index = state.cart.findIndex((item) => item._id === courseId)

      if (index >= 0) {
        // If the course is found in the cart, remove it
        state.totalItems--
        state.total -= state.cart[index].price
        state.cart.splice(index, 1)
        // Update to localstorage with user-specific keys
        if (userId) {
          const userIdString = String(userId)
          localStorage.setItem(getCartKey(userIdString), JSON.stringify(state.cart))
          localStorage.setItem(getTotalKey(userIdString), JSON.stringify(state.total))
          localStorage.setItem(getTotalItemsKey(userIdString), JSON.stringify(state.totalItems))
        }
        // show toast
        toast.success("Course removed from cart")
      }
    },
    resetCart: (state) => {
      const userId = getCurrentUserId()
      state.cart = []
      state.total = 0
      state.totalItems = 0
      // Remove user-specific cart from localstorage
      if (userId) {
        const userIdString = String(userId)
        localStorage.removeItem(getCartKey(userIdString))
        localStorage.removeItem(getTotalKey(userIdString))
        localStorage.removeItem(getTotalItemsKey(userIdString))
      }
      // Also remove old non-user-specific cart keys for backward compatibility
      localStorage.removeItem("cart")
      localStorage.removeItem("total")
      localStorage.removeItem("totalItems")
    },
    loadUserCart: (state, action) => {
      // Load cart for a specific user
      const userId = action.payload
      if (userId) {
        const userIdString = String(userId)
        // Migrate old cart data first
        migrateOldCart(userIdString)
        
        const cart = localStorage.getItem(getCartKey(userIdString))
          ? JSON.parse(localStorage.getItem(getCartKey(userIdString)))
          : []
        const total = localStorage.getItem(getTotalKey(userIdString))
          ? JSON.parse(localStorage.getItem(getTotalKey(userIdString)))
          : 0
        const totalItems = localStorage.getItem(getTotalItemsKey(userIdString))
          ? JSON.parse(localStorage.getItem(getTotalItemsKey(userIdString)))
          : 0
        
        state.cart = cart
        state.total = total
        state.totalItems = totalItems
      } else {
        // Clear cart if no user
        state.cart = []
        state.total = 0
        state.totalItems = 0
      }
    },
  },
})

export const { addToCart, removeFromCart, resetCart, loadUserCart } = cartSlice.actions

export default cartSlice.reducer