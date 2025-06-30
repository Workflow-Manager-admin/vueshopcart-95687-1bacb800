<template>
  <section>
    <!-- Wishlist -->
    <div class="wishlist-block">
      <h3 class="section-wtitle">My Wishlist</h3>
      <ul v-if="wishlistProductsSafe.length" class="mini-list">
        <li v-for="prod in wishlistProductsSafe" :key="prod.id">
          <img :src="prod.image" :alt="prod.name" class="small-img" />
          <span>{{ prod.name }}</span>
          <button @click="cart.addToCart(prod)">Add</button>
          <button class="remove" @click="cart.removeFromWishlist(prod.id)">✕</button>
        </li>
      </ul>
      <p v-else class="mini-faded">No saved items.</p>
    </div>

    <!-- Recently Viewed -->
    <div class="recent-block">
      <h3 class="section-wtitle">Recently viewed</h3>
      <div v-if="recentProductsSafe.length" class="recent-carousel">
        <div v-for="p in recentProductsSafe" :key="p.id" class="recent-card">
          <img :src="p.image" :alt="p.name" :title="p.name"/>
          <div>{{ p.name }}</div>
          <button @click="cart.addToCart(p)">Add</button>
        </div>
      </div>
      <p v-else class="mini-faded">No recently viewed items.</p>
    </div>

    <!-- Recommendations -->
    <div class="recommend-block">
      <h3 class="section-wtitle">Recommended for you</h3>
      <ul v-if="recommendedSafe.length" class="mini-list">
        <li v-for="prod in recommendedSafe" :key="prod.id">
          <img :src="prod.image" :alt="prod.name" class="small-img" />
          <span>{{ prod.name }}</span>
          <button @click="cart.addToCart(prod)">Add</button>
        </li>
      </ul>
      <p v-else class="mini-faded">No recommendations now.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'
const cart = useCartStore()
const { wishlist, recentlyViewed, products, recommendedProducts } = storeToRefs(cart)

// Compute arrays of non-undefined products to avoid mixing v-if with v-for
const wishlistProductsSafe = computed(() =>
  wishlist.value
    .map(id => products.value.find(p => p.id === id))
    .filter((prod): prod is NonNullable<typeof prod> => !!prod)
)
const recentProductsSafe = computed(() =>
  recentlyViewed.value
    .map(id => products.value.find(p => p.id === id))
    .filter((prod): prod is NonNullable<typeof prod> => !!prod)
)
const recommendedSafe = computed(() =>
  recommendedProducts.value
    .filter((prod): prod is NonNullable<typeof prod> => !!prod)
)
</script>

<style scoped>
.section-wtitle { font-size: 1.13rem; font-weight: bold; margin-bottom: 0.4em; color: #35495e; }
.mini-list { list-style: none; margin:0; padding:0; }
.mini-list li, .recent-card { display:flex; align-items:center; gap:0.6em; margin-bottom:0.5em; }
.small-img { width:32px; height:32px; border-radius:4px; object-fit:cover; }
button { background: #42b983; color: #fff; border:none; border-radius: 4px; font-size:0.96em; padding:0.2em 0.7em; cursor: pointer;}
button.remove { background: #f44336 }
.mini-faded { color:#bbb; font-size:0.98em }
.recent-carousel { display: flex; gap: 1em; overflow-x: auto; }
.recent-card {
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1em;
  min-width: 90px;
  background: #efefef;
  padding:0.4em;
  border-radius:7px;
}
.recent-card img { width: 70px; height: 60px; object-fit: cover; border-radius:5px; margin-bottom:0.2em;}
</style>
