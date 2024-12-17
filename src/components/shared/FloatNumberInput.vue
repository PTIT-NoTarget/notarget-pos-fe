<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    editable?: boolean;
    disabled?: boolean;
    modelValue: any;
    tooltip?: boolean;
    placeholder?: string;
    rules?: any;
  }>(),
  {
    editable: false,
    tooltip: true,
    disabled: false,
    placeholder: "",
    rules: () => true,
  }
);
const emit = defineEmits(["update:modelValue"]);
const value = computed({
  get: () => props.modelValue,
  set: (newValue) => {
    emit("update:modelValue", newValue);
  },
});

const formatFloatNumber = (value: string | number) => {
  if (!value) return "0";
  const num =
    typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
  return isNaN(num)
    ? "0"
    : num.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
};

const parseFloatNumber = (value: string) => {
  if (value == null || value === "") return 0;
  return parseFloat((value + "").replace(/,/g, ""));
};
</script>

<template>
  <template v-if="editable">
    <template v-if="tooltip">
      <v-tooltip location="top">
        <template v-slot:activator="{ props }">
          <v-text-field
            v-bind="props"
            density="compact"
            :model-value="formatFloatNumber(value)"
            @update:model-value="(val : any) => value = parseFloatNumber(val)"
            @blur="() => (value = parseFloatNumber(value))"
            hide-details="auto"
            :model-modifiers="{ lazy: true }"
            class="text-right"
            :disabled="disabled"
            :rules="rules"
            :placeholder="placeholder"
          ></v-text-field>
        </template>
        <span>{{ formatFloatNumber(value) }}</span>
      </v-tooltip>
    </template>
    <template v-else>
      <v-text-field
        density="compact"
        :model-value="formatFloatNumber(value)"
        @update:model-value="(val : any) => value = parseFloatNumber(val)"
        @blur="() => (value = parseFloatNumber(value))"
        hide-details="auto"
        :model-modifiers="{ lazy: true }"
        class="text-right"
        :disabled="disabled"
        :rules="rules"
        :placeholder="placeholder"
      ></v-text-field>
    </template>
  </template>
  <template v-else>
    <template v-if="tooltip">
      <v-tooltip location="top">
        <template v-slot:activator="{ props }">
          <span v-bind="props" class="d-block text-right me-3">
            {{ formatFloatNumber(value) }}
          </span>
        </template>
        <span>{{ formatFloatNumber(value) }}</span>
      </v-tooltip>
    </template>
    <template v-else>
      <span class="d-block text-right me-3">
        {{ formatFloatNumber(value) }}
      </span>
    </template>
  </template>
</template>

<style scoped lang="sass"></style>
