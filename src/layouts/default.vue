<template>
  <v-app>
    <AppHeader v-if="!route.meta.hideHeader" />
    <v-main>
      <router-view />
    </v-main>
    <v-overlay :model-value="loading" class="align-center justify-center">
      <v-progress-circular
        color="primary"
        size="64"
        indeterminate
      ></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { useLoadingStore } from "@/stores/loading";
import { storeToRefs } from "pinia";

const loadingStore = useLoadingStore();
const { loading } = storeToRefs(loadingStore);

const route = useRoute();

onUpdated(() => {
  document.title = (route.meta.title as string) || "Not Found";
});
</script>
