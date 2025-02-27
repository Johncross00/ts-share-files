<template>
  <div class="dynamic-page">
    <h1>{{ title }}</h1>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
      laboris nisi ut aliquip ex ea commodo consequat.
    </p>
    <p>
      Duis aute irure dolor in reprehenderit <strong>{{ title }}</strong> in voluptate velit esse
      cillum dolore <em>{{ title }}</em> eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
      non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>
    <p>
      Lorem ipsum dolor sit amet, <strong>{{ title }}</strong> consectetur adipiscing elit. Sed do
      eiusmod tempor incididunt ut labore <em>{{ title }}</em> et dolore magna aliqua. Ut enim ad
      minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
      consequat.
    </p>
    <p>
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
      <strong>{{ title }}</strong> fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
      proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const title = ref<string>(route.params.title as string)

watch(
  () => route.params.title,
  (newTitle) => {
    title.value = newTitle as string
  },
)
</script>

<style scoped>
.dynamic-page {
  padding: 20px;
}

.dynamic-page h1 {
  font-size: 2rem;
  margin-bottom: 20px;
}

.dynamic-page p {
  margin-bottom: 10px;
  line-height: 1.6;
}
</style>
