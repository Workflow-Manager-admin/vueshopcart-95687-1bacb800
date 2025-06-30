<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
const cart = useCartStore()
</script>

<template>
  <section class="product-list">
    <h2 class="section-title">Products</h2>
    <div class="filter-row">
      <input
        type="search"
        v-model="cart.searchQuery"
        class="search-input"
        placeholder="Search products..."
        aria-label="Search products"
      />
    </div>
    <div v-if="cart.filteredProducts.length === 0" class="empty-list-msg">
      No products match your search.
    </div>
    <div v-else class="product-grid">
      <div
        v-for="product in cart.filteredProducts"
        :key="product.id"
        class="product-card"
      >
        <img
          :src="product.image"
          :alt="product.name"
          class="product-img"
          @click="cart.openProductModal(product)"
          tabindex="0"
          :aria-label="`Show details for ${product.name}`"
        />
        <h3>{{ product.name }}</h3>
        <p class="desc">{{ product.description }}</p>
        <div class="price-row">
          <span class="price">${{ product.price.toFixed(2) }}</span>
          <button class="add-btn" @click="cart.addToCart(product)">Add to Cart</button>
        </div>
      </div>
    </div>

    <ProductModal v-if="cart.showProductModal && cart.modalProduct" />
  </section>
</template>

<script lang="ts">
import ProductModal from './ProductModal.vue'
export default { components: { ProductModal } }
</script>

<style scoped>
.product-list {
  padding: 1rem 0;
}
.section-title {
  font-size: 1.5rem;
  color: #35495e;
  margin-bottom: 1rem;
  font-weight: 700;
  letter-spacing: 0.01em;
}
.filter-row {
  margin-bottom: 1rem;
  display: flex;
  gap: 0.6em;
}
.search-input {
  font-size: 1rem;
  padding: 0.5em 1em;
  border-radius: 7px;
  border: 1px solid #dedede;
}
.search-input:focus {
  outline: 2px solid #42b983;
  border-color: #42b983;
}

.empty-list-msg {
  text-align: center;
  color: #999;
  margin: 2em 0 1em 0;
  font-size: 1.15rem;
}

.product-grid {
  display: grid;
  gap: 1.2rem;
  grid-template-columns: 1fr;
}
@media (min-width: 700px) {
  .product-grid {
    grid-template-columns: 1fr 1fr;
  }
}
@media (min-width: 1100px) {
  .product-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.product-card {
  border: 1px solid #eee;
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(66,185,131,0.07);
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  transition: box-shadow 0.2s;
}
.product-card:hover {
  box-shadow: 0 4px 16px rgba(66,185,131,0.13);
}
.product-img {
  width: 100%;
  max-height: 160px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: outline 0.18s;
}
.product-img:focus {
  outline: 2px solid #fcba03;
}
h3 {
  color: #42b983;
  margin: 0.2em 0 0.1em 0;
}
.desc {
  color: #57606a;
  flex: 1;
}
.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.price {
  font-weight: 600;
  color: #35495e;
  font-size: 1.12rem;
}
.add-btn {
  background: #42b983;
  color: #fff;
  border: none;
  padding: 0.35em 1em;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.18s;
}
.add-btn:hover {
  background: #35495e;
}
</style>
