<script setup lang="ts">
definePage({
  meta: {
    hideHeader: false,
    title: "Xem phiếu nhập hàng",
    requireOTP: true,
    requireAuth: true,
  },
});

onMounted(() => {

});

</script>

<template>
  <ProductImportDetailPage />
</template>

<style scoped lang="sass"></style>
