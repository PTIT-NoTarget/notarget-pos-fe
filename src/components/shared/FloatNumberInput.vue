<script setup lang="ts">

const formatFloatNumber = (value: string | number) => {
  if (!value) return ''
  const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value
  return isNaN(num) ? '' : num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })
}

const parseFloatNumber = (value: string) => {
  if (value == null || value == '') return 0
  return parseFloat((value + "").replace(/,/g, ''))
}

</script>

<template>

</template>

<style scoped lang="sass">

</style>
