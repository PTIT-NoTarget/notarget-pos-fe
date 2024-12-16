<script setup lang="ts">
definePage({
  meta: {
    hideHeader: false,
    title: "Xem phiếu nhập hàng",
    requireOTP: true,
    requireAuth: true,
  },
});

const route = useRoute();
const params = route.params as { id: string }

onMounted(() => {

});

</script>

<template>

</template>

<style scoped lang="sass"></style>
