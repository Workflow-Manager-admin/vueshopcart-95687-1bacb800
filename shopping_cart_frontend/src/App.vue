<template>
  <header class="app-header">
    <h1 class="app-title">🛒 Simple Shopping Cart</h1>
    <nav>
      <RouterLink to="/" class="nav-link" exact-active-class="active">Home</RouterLink>
      <RouterLink to="/about" class="nav-link" exact-active-class="active">About</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router"
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
