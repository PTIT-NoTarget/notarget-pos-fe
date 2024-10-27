<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  title: any
  modelValue: any
  list: any
  label?: string
}>(), {
  label: 'label'
})
const emit = defineEmits(['update:modelValue'])
const value = computed({
  get: () => props.modelValue,
  set: (newValue) => {
    emit('update:modelValue', newValue)
  }
})
</script>

<template>
  <v-row>
    <v-col cols="4" class="flex align-content-center">
      <span>
        {{ title }}
      </span>
    </v-col>
    <v-col cols="8">
      <v-autocomplete
        density="compact"
        hide-details="auto"
        v-model="value"
        :items="list"
        item-value="id"
        :item-title="label"
        clearable
        return-object
        hide-no-data
      ></v-autocomplete>
    </v-col>
  </v-row>
</template>

<style scoped lang="sass">

</style>
