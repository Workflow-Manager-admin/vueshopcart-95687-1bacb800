<script setup lang="ts">
import ProductList from "@/components/ProductList.vue";
import CartSummary from "@/components/CartSummary.vue";
</script>

<template>
  <main class="main-grid">
    <section class="left">
      <ProductList />
    </section>
    <aside class="right">
      <CartSummary />
    </aside>
  </main>
</template>

<style scoped>
.main-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 0;
}

.left,
.right {
  width: 100%;
}

@media (min-width: 900px) {
  .main-grid {
    flex-direction: row;
    align-items: flex-start;
  }
  .left {
    flex: 3;
    max-width: 65%;
    padding-right: 2rem;
  }
  .right {
    flex: 2;
    min-width: 320px;
  }
}
</style>
