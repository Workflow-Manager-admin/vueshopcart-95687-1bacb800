import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Product } from '@/types/product'
import type { CartItem } from '@/types/cartItem'

/**
 * PUBLIC_INTERFACE
 * useCartStore - Pinia store for product list, cart management, filtering, and UI dialog state.
 */
export const useCartStore = defineStore('cart', () => {
  // Base set of products (static, could fetch in real app)
  const products = ref<Product[]>([
    {
      id: 1,
      name: "Wireless Mouse",
      description: "Ergonomic wireless mouse with fast scrolling and precision.",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=cover&w=400&q=80"
    },
    {
      id: 2,
      name: "Mechanical Keyboard",
      description: "Tactile mechanical keyboard, backlit keys.",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=cover&w=400&q=80"
    },
    {
      id: 3,
      name: "HD Monitor",
      description: "24-inch Full HD monitor with crisp visuals.",
      price: 159.99,
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=cover&w=400&q=80"
    }
  ])
  // Category support removed; base app uses only a flat product list

  // Cart state, persisted to localStorage
  const cartItems = ref<CartItem[]>([])

  // Product search/filter
  const searchQuery = ref<string>('')
  // Remove category selection (not used, as no category on Product)
  // const selectedCategory = ref<string>('')

  // Modal (product detail) dialog state
  const showProductModal = ref(false)
  const modalProduct = ref<Product | null>(null)

  // Simulated checkout state
  const checkoutStep = ref<'cart' | 'checkout' | 'confirmed'>('cart')
  const checkoutMsg = ref<string>('')

  // ---- Storage Persistence ----
  const STORAGE_KEY = 'vue_shopping_cart'
  function loadCart() {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        cartItems.value = JSON.parse(raw) ?? []
      } catch {
        cartItems.value = []
      }
    }
  }
  function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems.value))
  }
  // On startup/load
  loadCart()
  watch(cartItems, saveCart, { deep: true })

  // ---- Cart Actions ----
  /**
   * PUBLIC_INTERFACE
   * Add a product to the cart (increases quantity if already present)
   */
  function addToCart(product: Product) {
    const item = cartItems.value.find(i => i.product.id === product.id)
    if (item) {
      item.quantity += 1
    } else {
      cartItems.value.push({ product, quantity: 1 })
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Remove a product entirely from the cart
   */
  function removeFromCart(productId: number) {
    cartItems.value = cartItems.value.filter(item => item.product.id !== productId)
  }

  /**
   * PUBLIC_INTERFACE
   * Decrease quantity of a cart item by 1, or remove if zero
   */
  function decreaseCartItem(productId: number) {
    const item = cartItems.value.find(i => i.product.id === productId)
    if (item) {
      item.quantity -= 1
      if (item.quantity <= 0) {
        removeFromCart(productId)
      }
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Set quantity to a specific value (min 1, max 99 for safety)
   */
  function setCartItemQuantity(productId: number, qty: number) {
    const item = cartItems.value.find(i => i.product.id === productId)
    if (item) {
      if (qty <= 0) removeFromCart(productId)
      else item.quantity = Math.min(99, Math.max(1, Math.floor(qty)))
    }
  }

  /**
   * PUBLIC_INTERFACE
   * Clear the cart (set to empty array)
   */
  function clearCart() {
    cartItems.value = []
  }

  /**
   * PUBLIC_INTERFACE
   * Simulate checkout: clears cart, shows confirmation, resets step after brief delay
   */
  function checkout() {
    checkoutStep.value = 'checkout'
    setTimeout(() => {
      clearCart()
      checkoutMsg.value = 'Thank you for your purchase! 🎉'
      checkoutStep.value = 'confirmed'
      setTimeout(() => {
        checkoutStep.value = 'cart'
        checkoutMsg.value = ''
      }, 1900)
    }, 1200)
  }

  /**
   * PUBLIC_INTERFACE
   * Return calculated subtotal/tax/total for the cart. Tax is a flat 8.5%.
   */
  const cartSummary = computed(() => {
    const subtotal = cartItems.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    const tax = +(subtotal * 0.085)
    const total = subtotal + tax
    return {
      subtotal,
      tax,
      total
    }
  })

  /**
   * PUBLIC_INTERFACE
   * Filter products with current search query and category.
   */
  const filteredProducts = computed(() => {
    let list = products.value
    const query = searchQuery.value.toLowerCase().trim()
    if (query) {
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          (p.description && p.description.toLowerCase().includes(query))
      )
    }
    return list
  })

  // For modal dialog support
  function openProductModal(product: Product) {
    modalProduct.value = product
    showProductModal.value = true
  }
  function closeProductModal() {
    showProductModal.value = false
    modalProduct.value = null
  }

  return {
    products,
    cartItems,
    addToCart,
    removeFromCart,
    decreaseCartItem,
    setCartItemQuantity,
    clearCart,
    cartSummary,
    searchQuery,
    filteredProducts,
    // Modal dialog:
    showProductModal,
    modalProduct,
    openProductModal,
    closeProductModal,
    // Checkout:
    checkout, checkoutStep, checkoutMsg
  }
})
