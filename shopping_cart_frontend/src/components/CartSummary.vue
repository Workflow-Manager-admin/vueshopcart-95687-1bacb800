<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
const cart = useCartStore()
</script>

<template>
  <aside class="cart-summary">
    <h2 class="section-title">Shopping Cart</h2>
    <div v-if="cart.cartItems.length === 0" class="empty-cart">
      <span>Your cart is empty.</span>
    </div>
    <ul v-else class="cart-items">
      <li v-for="item in cart.cartItems" :key="item.product.id" class="cart-item">
        <img :src="item.product.image" :alt="item.product.name" class="cart-thumb"/>
        <div class="cart-info">
          <div class="cart-product-name">{{ item.product.name }}</div>
          <div class="cart-item-controls">
            <button
              class="qty-btn"
              @click="cart.decreaseCartItem(item.product.id)"
              aria-label="Decrease quantity"
            >−</button>
            <span class="qty">{{ item.quantity }}</span>
            <button
              class="qty-btn"
              @click="cart.addToCart(item.product)"
              aria-label="Increase quantity"
            >+</button>
          </div>
        </div>
        <div class="cart-item-end">
          <span class="line-total">${{ (item.product.price * item.quantity).toFixed(2) }}</span>
          <button class="remove-btn" @click="cart.removeFromCart(item.product.id)" aria-label="Remove">
            ×
          </button>
        </div>
      </li>
    </ul>
    <div v-if="cart.cartItems.length > 0" class="cart-footer">
      <div class="breakdown-row">
        <div>
          <div>Subtotal:</div>
          <div>Tax (8.5%):</div>
          <div class="cart-total-label">Total:</div>
        </div>
        <div style="text-align:right;">
          <div>${{ cart.cartSummary.subtotal.toFixed(2) }}</div>
          <div>${{ cart.cartSummary.tax.toFixed(2) }}</div>
          <div class="cart-total-amount">${{ cart.cartSummary.total.toFixed(2) }}</div>
        </div>
      </div>
      <div class="cart-actions">
        <button class="clear-btn" @click="cart.clearCart">Clear Cart</button>
        <button
          class="checkout-btn"
          @click="cart.checkout"
          :disabled="cart.checkoutStep !== 'cart' || cart.cartItems.length === 0"
        >Checkout</button>
      </div>
      <div v-if="cart.checkoutStep === 'checkout'" class="checkout-msg">Processing...</div>
      <div v-if="cart.checkoutStep === 'confirmed'" class="checkout-msg confirmed">
        {{ cart.checkoutMsg }}
      </div>
    </div>
  </aside>
</template>

<style scoped>
.cart-summary {
  background: #fafbfc;
  border-left: 3px solid #42b983;
  padding: 1.5rem 1rem;
  min-width: 260px;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(53,73,94,0.07);
  max-width: 420px;
  margin: 0 auto;
}
@media (max-width: 599px) {
  .cart-summary { padding: 1rem 0.1rem }
}
.section-title {
  font-size: 1.5rem;
  color: #35495e;
  margin-bottom: 1rem;
  font-weight: 700;
  letter-spacing: 0.01em;
}
.empty-cart {
  padding: 2.1rem 0 2.4rem 0;
  color: #888;
  text-align: center;
  font-size: 1.14rem;
}
.cart-items {
  list-style: none;
  padding: 0;
  margin: 0;
}
.cart-item {
  display: flex;
  align-items: flex-start;
  border-bottom: 1px solid #eee;
  padding: 0.6rem 0 0.7rem 0;
  gap: 0.55rem;
}
.cart-thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 0.7rem;
}
.cart-info {
  flex: 1;
}
.cart-product-name {
  color: #42b983;
  font-weight: 500;
  margin-bottom: 0.15em;
}
.cart-item-controls {
  display: flex;
  align-items: center;
  gap: 0.25em;
}
.qty-btn {
  width: 27px;
  height: 27px;
  border: 0;
  background: #fcba03;
  color: #fff;
  font-size: 1.25em;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.18s;
}
.qty-btn:hover {
  background: #42b983;
}
.qty {
  min-width: 1.7em;
  text-align: center;
}
.cart-item-end {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3em;
}
.line-total {
  color: #35495e;
  font-weight: 600;
}
.remove-btn {
  border: 0;
  background: #ffeded;
  color: #f44336;
  border-radius: 5px;
  font-size: 1.1em;
  padding: 0 0.5em;
  cursor: pointer;
  transition: background 0.13s;
}
.remove-btn:hover {
  background: #fcba03;
  color: #fff;
}

.cart-footer {
  margin-top: 1.7em;
  border-top: 1px solid #eee;
  padding-top: 1.2em;
}
.breakdown-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.2em;
  font-size: 1.08em;
  margin-bottom: 1em;
}
.cart-total-label {
  color: #35495e;
  font-weight: bold;
}
.cart-total-amount {
  color: #42b983;
  font-weight: 700;
  font-size: 1.2rem;
}
.cart-actions {
  display: flex;
  flex-direction: row;
  gap: 1em;
  align-items: center;
}

.clear-btn, .checkout-btn {
  border: none;
  background: #35495e;
  color: #fff;
  border-radius: 6px;
  padding: 0.3em 1.18em;
  cursor: pointer;
  font-weight: 500;
  font-size: 1.06em;
  margin-bottom: 0;
  transition: background 0.17s;
}
.clear-btn:hover, .checkout-btn:enabled:hover {
  background: #42b983;
}
.checkout-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.checkout-msg {
  margin-top: 1.5em;
  font-size: 1.12em;
  color: #35495e;
  transition: color 0.16s;
}
.checkout-msg.confirmed {
  color: #42b983;
  font-weight: 700;
}
@media (max-width: 800px) {
  .cart-summary {
    min-width: 175px;
    padding: 1.1rem 0.1rem;
  }
}
</style>
