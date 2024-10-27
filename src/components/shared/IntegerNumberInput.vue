<script setup lang="ts">
withDefaults(defineProps<{
  editable?: boolean
  item: any
  keyName: string
  tooltip?: boolean
}>(), {
  editable: false,
  tooltip: true
})
const formatIntegerNumber = (value: string | number) => {
  if (!value) return ''
  const num = typeof value === 'string' ? parseInt(value.replace(/,/g, '')) : value
  return isNaN(num) ? '' : num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

const parseIntegerNumber = (value: any) => {
  if (value == null || value == '') return 0
  return parseInt((value + '').replace(/,/g, ''))
}

const handleNumberChange = (item: any, key: string, change: number) => {
  const currentValue = parseInt(item[key])
  item[key] = currentValue + change
}
</script>

<template>
  <template v-if="editable">
    <template v-if="tooltip">
      <v-tooltip location="top">
        <template v-slot:activator="{ props }">
          <v-text-field
            v-bind="props"
            density="compact"
            :model-value="formatIntegerNumber(item[keyName])"
            @update:model-value="(val : any) => item[keyName] = parseIntegerNumber(val)"
            @blur="() => item[keyName] = parseIntegerNumber(item[keyName])"
            hide-details="auto"
            :model-modifiers="{ lazy: true }"
            :append-inner-icon="'mdi-minus'"
            @click:append-inner="() => handleNumberChange(item, keyName, -1)"
            :prepend-inner-icon="'mdi-plus'"
            @click:prepend-inner="() => handleNumberChange(item, keyName, 1)"
            class="text-right"
          ></v-text-field>
        </template>
        <span>{{ formatIntegerNumber(item[keyName]) }}</span>
      </v-tooltip>
    </template>
    <template v-else>
      <v-text-field
        density="compact"
        :model-value="formatIntegerNumber(item[keyName])"
        @update:model-value="(val : any) => item[keyName] = parseIntegerNumber(val)"
        @blur="() => item[keyName] = parseIntegerNumber(item[keyName])"
        hide-details="auto"
        :model-modifiers="{ lazy: true }"
        :append-inner-icon="'mdi-minus'"
        @click:append-inner="() => handleNumberChange(item, keyName, -1)"
        :prepend-inner-icon="'mdi-plus'"
        @click:prepend-inner="() => handleNumberChange(item, keyName, 1)"
        class="text-right"
      ></v-text-field>
    </template>
  </template>
  <template v-else>
    <template v-if="tooltip">
      <v-tooltip location="top">
        <template v-slot:activator="{ props }">
        <span v-bind="props" class="d-block text-right">
          {{ formatIntegerNumber(item[keyName]) }}
        </span>
        </template>
        <span>{{ formatIntegerNumber(item[keyName]) }}</span>
      </v-tooltip>
    </template>
    <template v-else>
      <span class="d-block text-right">
        {{ formatIntegerNumber(item[keyName]) }}
      </span>
    </template>
  </template>
</template>

<style scoped lang="sass">

</style>
