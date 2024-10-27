<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: any
}>(), {})
</script>

<template>
  <v-row class="mb-1">
    <v-col cols="4">
      <span>{{ title }}</span>
    </v-col>
    <v-col cols="8">

    </v-col>
  </v-row>
</template>

<style scoped lang="sass">

</style>
