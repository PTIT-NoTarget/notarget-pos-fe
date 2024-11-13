<script setup lang="ts">
definePage({
  meta: {
    hideHeader: false,
    title: "Danh sách hàng hóa",
    requireOTP: true,
    requireAuth: true,
  },
});
</script>

<template>
  <ProductListPage />
</template>

<style scoped lang="sass"></style>
