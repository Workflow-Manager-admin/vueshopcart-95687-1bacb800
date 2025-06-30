import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Product } from '@/types/product'
import type { CartItem } from '@/types/cartItem'

/**
 * PUBLIC_INTERFACE
 * useCartStore - Pinia store for product list, cart management, wishlist, currency, theme, and UI dialog state.
 */
export const useCartStore = defineStore('cart', () => {
  // ===== Base set of products (static) =====
  const products = ref<Product[]>([
    {
      id: 1,
      name: "Wireless Mouse",
      description: "Ergonomic wireless mouse with fast scrolling and precision.",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=cover&w=400&q=80",
      stock: 3
    },
    {
      id: 2,
      name: "Mechanical Keyboard",
      description: "Tactile mechanical keyboard, backlit keys.",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=cover&w=400&q=80",
      stock: 1
    },
    {
      id: 3,
      name: "HD Monitor",
      description: "24-inch Full HD monitor with crisp visuals.",
      price: 159.99,
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=cover&w=400&q=80",
      stock: 8
    }
  ])
  // Category support removed; base app uses only a flat product list

  // ========== Cart state, persisted to localStorage ==========
  const cartItems = ref<CartItem[]>([])

  // ========== Wishlist (localStorage) ==========
  const wishlist = ref<number[]>([])
  const WISHLIST_KEY = 'vue_wishlist'
  function loadWishlist() {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      wishlist.value = raw ? JSON.parse(raw) : [];
    } catch {
      wishlist.value = []
    }
  }
  function saveWishlist() {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist.value))
  }

  // ========== Recently viewed ==========
  const recentlyViewed = ref<number[]>([])
  const RECENT_KEY = 'vue_recently_viewed'
  function addRecentlyViewed(id: number) {
    recentlyViewed.value = [id, ...recentlyViewed.value.filter(i => i !== id)].slice(0, 10)
    localStorage.setItem(RECENT_KEY, JSON.stringify(recentlyViewed.value))
  }
  function loadRecentlyViewed() {
    const raw = localStorage.getItem(RECENT_KEY)
    recentlyViewed.value = raw ? JSON.parse(raw) : []
  }

  // ========== Coupon & Discounts =========
  const coupons = ref<{[key: string]: number}>({
    "DISCOUNT10": 0.1, // 10% off
    "SALE5": 0.05 // 5% off
  })
  const activeCoupon = ref<string>('')
  const couponApplied = ref(false)
  function applyCoupon(code: string) {
    if (coupons.value[code]) {
      activeCoupon.value = code
      couponApplied.value = true
      showSnackbar(`Coupon "${code}" applied!`, 'success')
    } else {
      showSnackbar("Invalid coupon code.", 'error')
      couponApplied.value = false
    }
  }
  function clearCoupon() {
    activeCoupon.value = ''
    couponApplied.value = false
  }

  // ========== Product search/filter ==========
  const searchQuery = ref<string>('')
  // Remove category selection (not used, as no category on Product)

  // ========== Modal (product detail) dialog state ==========
  const showProductModal = ref(false)
  const modalProduct = ref<Product | null>(null)

  // ========== Simulated checkout state ==========
  const checkoutStep = ref<'cart' | 'checkout' | 'confirmed'>( 'cart')
  const checkoutMsg = ref<string>('')

  // ========== Theme (dark/light) ==========
  const theme = ref<'light' | 'dark'>(
    localStorage.getItem('app_theme') as 'light' | 'dark' || 'light'
  )
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('app_theme', theme.value)
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  // ========== Currency ==========
  const CURRENCIES = [
    { code: 'USD', symbol: '$', label: 'US Dollar' },
    { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
    { code: 'EUR', symbol: '€', label: 'Euro' },
  ]
  const currency = ref(localStorage.getItem('app_currency') || 'USD')
  function setCurrency(newCurr: string) {
    currency.value = newCurr
    localStorage.setItem('app_currency', newCurr)
  }
  function formatCurrency(amount: number) {
    let fmt: Intl.NumberFormatOptions = {};
    if (currency.value === 'INR') fmt = { style: 'currency', currency: 'INR' }
    else if (currency.value === 'EUR') fmt = { style: 'currency', currency: 'EUR' }
    else fmt = { style: 'currency', currency: 'USD' }
    return (amount).toLocaleString(undefined, fmt)
  }

  // ========== Storage Persistence ==========
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
  loadWishlist()
  watch(wishlist, saveWishlist)
  loadRecentlyViewed()
  // ========== Cart Actions ==========
  /**
   * PUBLIC_INTERFACE
   * Add a product to the cart (increases quantity if already present)
   */
  function addToCart(product: Product) {
    const item = cartItems.value.find(i => i.product.id === product.id)
    if (item) {
      // limit by available stock
      if (item.quantity >= (product.stock || 99)) {
        showSnackbar('No more stock for this item.', 'error')
        return
      }
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
    // Save for undo
    const removed = cartItems.value.find(i => i.product.id === productId)
    if (removed) lastRemoved.value = { ...removed }
    cartItems.value = cartItems.value.filter(item => item.product.id !== productId)
    // Show snackbar for undo
    showUndoSnackbarFn()
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
      else item.quantity = Math.min((item.product.stock || 99), Math.max(1, Math.floor(qty)))
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
   * Simulate checkout: clears cart, shows confirmation, resets step after brief delay.
   * Save invoice (as JSON, in real app would be PDF).
   */
  function checkout() {
    checkoutStep.value = 'checkout'
    setTimeout(() => {
      saveInvoice()
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
   * Coupon/discount applied to subtotal.
   */
  const cartSummary = computed(() => {
    const subtotal = cartItems.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    let discount = 0
    if (activeCoupon.value && couponApplied.value && coupons.value[activeCoupon.value]) {
      discount = subtotal * coupons.value[activeCoupon.value]
    }
    const taxed = subtotal - discount
    const tax = +(taxed * 0.085)
    const total = taxed + tax
    return {
      subtotal,
      discount,
      taxed,
      tax,
      total
    }
  })

  /**
   * PUBLIC_INTERFACE
   * Filter products with current search query.
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

  // For modal dialog support and recently viewed:
  function openProductModal(product: Product) {
    modalProduct.value = product
    showProductModal.value = true
    addRecentlyViewed(product.id)
  }
  function closeProductModal() {
    showProductModal.value = false
    modalProduct.value = null
  }

  // ==================== Undo for Remove ===================
  const lastRemoved = ref<CartItem | null>(null)
  function undoRemove() {
    if (lastRemoved.value) {
      const exist = cartItems.value.find(i => i.product.id === lastRemoved.value?.product.id)
      if (!exist) {
        cartItems.value.push(lastRemoved.value)
        showSnackbar('Undo: Item restored.', 'success')
        lastRemoved.value = null
      }
    }
    showUndoSnackbar.value = false
  }
  const showUndoSnackbar = ref(false)
  function showUndoSnackbarFn() {
    showUndoSnackbar.value = true
    setTimeout(() => { showUndoSnackbar.value = false }, 4800)
  }

  // ==================== Snackbar ===================
  const snackbar = ref<{ msg: string, type: string, show: boolean }>({ msg: '', type: '', show: false })
  function showSnackbar(msg: string, type: string = 'info') {
    snackbar.value = { msg, type, show: true }
    setTimeout(() => { snackbar.value.show = false }, 3600)
  }

  // ==================== Invoice Generation ===================
  const invoiceData = ref<string | null>(null)
  function saveInvoice() {
    const data = {
      items: cartItems.value,
      summary: cartSummary.value,
      date: new Date().toISOString()
    }
    invoiceData.value = JSON.stringify(data, null, 2)
    localStorage.setItem('latest_invoice', invoiceData.value)
  }
  function downloadInvoice() {
    if (!invoiceData.value) return
    const blob = new Blob([invoiceData.value], { type: "application/json" })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'invoice.json'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  // ========== Recommendations ===========
  const recommendedProducts = computed(() => {
    const cartIds = new Set(cartItems.value.map(ci => ci.product.id))
    // Recommend products not in cart, random order up to 3
    return products.value.filter(p => !cartIds.has(p.id)).slice(0, 3)
  })

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
    checkout, checkoutStep, checkoutMsg,
    // Wishlist:
    wishlist,
    loadWishlist,
    saveWishlist,
    addToWishlist: (id: number) => {
      if (!wishlist.value.includes(id)) {
        wishlist.value.push(id)
        showSnackbar('Added to wishlist!', 'success')
      }
    },
    removeFromWishlist: (id: number) => {
      wishlist.value = wishlist.value.filter(pid => pid !== id)
      showSnackbar('Removed from wishlist.', 'info')
    },
    // Recently viewed:
    recentlyViewed,
    addRecentlyViewed,
    // Coupons:
    activeCoupon, couponApplied, coupons, applyCoupon, clearCoupon,
    // Snackbar/Undo
    snackbar,
    showSnackbar,
    showUndoSnackbar,
    showUndoSnackbarFn,
    undoRemove,
    // Currency:
    currency,
    CURRENCIES,
    setCurrency,
    formatCurrency,
    // Theme:
    theme,
    toggleTheme,
    // Invoice
    invoiceData,
    downloadInvoice,
    // Stock logic:
    productStock: (id: number) => products.value.find(p => p.id === id)?.stock || 0,
    // Recommendations
    recommendedProducts,
  }
})
