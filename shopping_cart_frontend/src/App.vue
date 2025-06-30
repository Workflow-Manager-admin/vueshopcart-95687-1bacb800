<template>
  <header class="app-header">
    <h1 class="app-title">🛒 Simple Shopping Cart</h1>
    <nav>
      <RouterLink to="/" class="nav-link" exact-active-class="active">Home</RouterLink>
      <RouterLink to="/about" class="nav-link" exact-active-class="active">About</RouterLink>
    </nav>
    <div class="header-widgets">
      <select v-model="cart.currency" @change="cart.setCurrency(cart.currency)" aria-label="Currency">
        <option v-for="c in cart.CURRENCIES" :key="c.code" :value="c.code">{{c.symbol}} - {{c.label}}</option>
      </select>
      <button @click="cart.toggleTheme" :aria-label="`Switch ${cart.theme==='light'?'dark':'light'} mode`">
        <span v-if="cart.theme==='light'">🌙</span>
        <span v-else>🌞</span>
      </button>
      <form class="coupon-widget" @submit.prevent="applyCouponCode">
        <input v-model="couponInput" placeholder="Coupon code" type="text" aria-label="Coupon code"/>
        <button type="submit">Apply</button>
      </form>
    </div>
  </header>
  <RouterView />
  <!-- Snackbar for general info, success, error -->
  <AppSnackbar
    :show="cart.snackbar.show"
    :message="cart.snackbar.msg"
    :type="snackbarType"
  />
  <!-- Snackbar for undo/remove (persistent, with undo) -->
  <AppSnackbar
    v-if="cart.showUndoSnackbar"
    :show="cart.showUndoSnackbar"
    message="Item removed."
    :undo="cart.undoRemove"
    type="info"
  />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router"
import { ref } from "vue"
import { useCartStore } from "@/stores/cart"
import AppSnackbar from "@/components/AppSnackbar.vue"
const cart = useCartStore()
const couponInput = ref('')
function applyCouponCode() {
  if (couponInput.value) cart.applyCoupon(couponInput.value.trim())
  couponInput.value = ''
}
import { computed } from "vue"
// Make sure only valid type is passed!
const snackbarType = computed(() => {
  const t = cart.snackbar.type
  return t === "success" || t === "error" || t === "info" ? t : "info";
});
</script>

<style scoped>
.app-header {
  background: #fff;
  padding: 1.7rem 0 0.7rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 12px rgba(53,73,94,0.06);
  margin-bottom: 1.5rem;
}
.app-title {
  color: #42b983;
  font-size: 2.1rem;
  font-weight: 900;
  letter-spacing: -1px;
  margin-bottom: 0.7rem;
}
nav {
  display: flex;
  gap: 1.7rem;
}
.nav-link {
  color: #35495e;
  font-size: 1.08rem;
  text-decoration: none;
  font-weight: 500;
  opacity: 0.89;
  transition: color 0.17s;
}
.nav-link:hover, .nav-link.active {
  color: #42b983;
  border-bottom: 3px solid #fcba03;
  padding-bottom: 0.1em;
}
</style>
