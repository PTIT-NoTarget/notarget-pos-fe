<script setup lang="ts">
definePage({
  meta: {
    hideHeader: false,
    title: "Nhân viên",
    requireOTP: true,
    requireAuth: true,
  },
});
</script>

<template>
  <EmployeePage />
</template>

<style scoped lang="sass"></style>
