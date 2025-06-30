<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
const cart = useCartStore()

function handleBackgroundClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
    cart.closeProductModal()
  }
}
</script>

<template>
  <div class="modal-backdrop" @click="handleBackgroundClick">
    <div class="modal-sheet" tabindex="0">
      <button class="close-btn" aria-label="Close" @click="cart.closeProductModal">×</button>
      <img v-if="cart.modalProduct?.image"
           :src="cart.modalProduct.image"
           :alt="cart.modalProduct.name"
           class="modal-img" />
      <h2 class="modal-title">{{ cart.modalProduct?.name }}</h2>
      <p class="modal-desc">{{ cart.modalProduct?.description }}</p>
      <p class="modal-price">Price: <span>${{ cart.modalProduct?.price.toFixed(2) }}</span></p>
      <button class="add-btn" @click="cart.addToCart(cart.modalProduct!)">Add to Cart</button>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(30, 40, 70, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 90;
  animation: fadeIn 0.2s;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.modal-sheet {
  background: #fff;
  border-radius: 18px;
  min-width: 320px;
  max-width: 98vw;
  width: 330px;
  box-shadow: 0 8px 48px rgba(66,185,131,0.13);
  padding: 2rem 2rem 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  animation: popupIn 0.25s;
}
@keyframes popupIn {
  from { transform: translateY(60px) scale(0.85); opacity:0.8;}
  to { transform: translateY(0) scale(1); opacity:1;}
}
.close-btn {
  position: absolute;
  top: 1.2em;
  right: 1.6em;
  font-size: 1.9rem;
  border: none;
  background: none;
  color: #35495e;
  cursor: pointer;
}
.close-btn:hover { color: #f44336; }
.modal-img {
  width: 160px;
  height: 110px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 1em;
  box-shadow: 0 2px 10px #eee;
}
.modal-title {
  color: #42b983;
  font-weight: 700;
  margin-bottom: 0.25em;
  text-align: center;
}
.modal-desc {
  color: #57606a;
  text-align: center;
  margin-bottom: 0.8em;
}
.modal-price {
  color: #35495e;
  font-weight: 600;
  margin-bottom: 1.1em;
}
.modal-price span {
  color: #fcba03;
}
.add-btn {
  background: #42b983;
  color: #fff;
  border: none;
  padding: 0.35em 1.3em;
  border-radius: 7px;
  font-size: 1.03em;
  cursor: pointer;
  margin-top: 4px;
  font-weight: 600;
  transition: background 0.17s;
}
.add-btn:hover {
  background: #35495e;
}
</style>
