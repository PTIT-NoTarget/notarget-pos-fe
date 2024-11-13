<script setup lang="ts">
definePage({
  meta: {
    hideHeader: false,
    title: "Trang chủ",
    requireOTP: true,
    requireAuth: true,
  },
});
</script>

<template>
  <HomePage />
</template>

<style scoped lang="sass"></style>
