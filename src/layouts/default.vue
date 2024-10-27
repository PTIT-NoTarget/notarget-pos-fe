<template>
  <v-app>
    <AppHeader v-if="!route.meta.hideHeader" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'

const route = useRoute()

  onMounted(() => {
    document.title = (route.meta.title as string) || 'Not Found'
  })
</script>
