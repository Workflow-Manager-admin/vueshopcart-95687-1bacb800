import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '@/types/product'
import type { CartItem } from '@/types/cartItem'

/**
 * PUBLIC_INTERFACE
 * useCartStore - Pinia store for product list and cart management.
 */
export const useCartStore = defineStore('cart', () => {
  // Hardcoded sample products (in real app, could fetch from API)
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
  const cartItems = ref<CartItem[]>([])

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
   * Decrease quantity of a cart item by 1, or remove it if quantity reaches zero
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
   * Clear the cart
   */
  function clearCart() {
    cartItems.value = []
  }

  /**
   * PUBLIC_INTERFACE
   * Total price getter for all items in the cart
   */
  const total = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  )

  return {
    products,
    cartItems,
    addToCart,
    removeFromCart,
    decreaseCartItem,
    clearCart,
    total
  }
})
