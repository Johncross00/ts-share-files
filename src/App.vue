<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import { useUserStore } from './stores/userStore'
import { computed } from 'vue'

const userStore = useUserStore()
const isAuthenticated = computed<boolean>(() => userStore.isAuthenticated)
</script>

<template>
  <nav>
    <NavBar v-if="isAuthenticated" />
  </nav>
  <main class="main-content">
    <RouterView />
  </main>
</template>

<style scoped>
.main-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 5px;
  position: relative;
  top: 0;
  left: 0;
}

nav {
  width: 100%;
  font-size: 1rem;
  padding: 1rem 0;
}
</style>
