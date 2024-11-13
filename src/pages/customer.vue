<script setup lang="ts">
definePage({
  meta: {
    hideHeader: false,
    title: "Khách hàng",
    requireOTP: true,
    requireAuth: true,
  },
});
</script>

<template>
  <CustomerPage />
</template>

<style scoped lang="sass"></style>
