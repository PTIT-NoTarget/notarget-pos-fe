import { defineStore } from "pinia";
import { ref } from "vue";

export const useLoadingStore = defineStore("loading", () => {
  const loading = ref(false);

  const showLoading = () => {
    loading.value = true;
  };

  const hideLoading = () => {
    loading.value = false;
  };

  return { loading, showLoading, hideLoading };
});
