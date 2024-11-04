<script setup lang="ts">
import {computed} from 'vue'
import {Enum} from "@/utils/Enum";

const props = withDefaults(defineProps<{
  editable?: boolean
  modelValue: any
  tooltip?: boolean
  keyName?: keyof typeof Enum
  variant?: any
}>(), {
  editable: false,
  tooltip: true,
  variant: 'filled'
})
const emit = defineEmits(['update:modelValue'])

const value = computed({
  get: () => props.modelValue,
  set: (newValue) => {
    emit('update:modelValue', newValue)
  }
})

const items = computed(() => {
  return props.keyName ? Object.values(Enum[props.keyName]) : [];
});

const getLabel = (value: string) => {
  return props.keyName ? Enum[props.keyName][value].label : value;
}

</script>

<template>
  <template v-if="editable">
    <template v-if="tooltip">
      <v-tooltip location="top">
        <template v-slot:activator="{ props: slotProps }">
          <v-autocomplete
            v-bind="slotProps"
            density="compact"
            hide-details="auto"
            v-model="value"
            :items="items"
            item-value="value"
            item-title="label"
            hide-no-data
            :variant="variant"
          ></v-autocomplete>
        </template>
        <span> {{ getLabel(value) }} </span>
      </v-tooltip>
    </template>
    <template v-else>
      <v-autocomplete
        density="compact"
        hide-details="auto"
        v-model="value"
        :items="items"
        item-value="value"
        item-title="label"
        hide-no-data
        :variant="variant"
      ></v-autocomplete>
    </template>
  </template>
  <template v-else>
    <template v-if="tooltip">
      <v-tooltip location="top">
        <template v-slot:activator="{ props: slotProps }">
          <span v-bind="slotProps" class="d-block text-right">
            {{ getLabel(value) }}
          </span>
        </template>
        <span>{{ getLabel(value) }}</span>
      </v-tooltip>
    </template>
    <template v-else>
      <span class="d-block text-right">
        {{ getLabel(value) }}
      </span>
    </template>
  </template>
</template>

<style scoped lang="sass">
</style>
