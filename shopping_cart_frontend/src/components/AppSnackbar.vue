<template>
  <transition name="snackbar-fade">
    <div v-if="show" :class="['snackbar', type]">
      <slot>{{ message }}</slot>
      <button v-if="undo" class="snackbar-undo" @click="undo()">Undo</button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
defineProps({
  show: Boolean,
  message: String,
  type: {
    type: String as PropType<'info' | 'success' | 'error'>,
    default: 'info'
  },
  undo: Function as PropType<() => void>
})
</script>

<style scoped>
.snackbar {
  position: fixed;
  left: 50%;
  bottom: 2.5em;
  transform: translateX(-50%);
  min-width: 180px;
  padding: 1em 2.5em 1em 1.1em;
  color: #fff;
  background: #35495e;
  border-radius: 5px;
  box-shadow: 0 3px 16px #8887;
  font-weight: 500;
  z-index: 2222;
  display: flex;
  align-items: center;
  gap: 1em;
}
.snackbar.success { background: #42b983 }
.snackbar.error { background: #f44336 }
.snackbar-undo {
  background: none;
  color: #fcba03;
  border: none;
  font-size: 1.09em;
  cursor: pointer;
  font-weight: bold;
}
.snackbar-fade-enter-active, .snackbar-fade-leave-active {
  transition: opacity 0.37s;
}
.snackbar-fade-enter-from, .snackbar-fade-leave-to {
  opacity: 0;
}
</style>
