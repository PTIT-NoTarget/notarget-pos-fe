<script setup lang="ts">
import { computed, toRefs } from "vue";

const props = withDefaults(
  defineProps<{
    editable?: boolean;
    disabled?: boolean;
    modelValue: any;
    tooltip?: boolean;
    isArea?: boolean;
  }>(),
  {
    editable: false,
    tooltip: true,
    isArea: false,
    disabled: false,
  }
);
const emit = defineEmits(["update:modelValue"]);

const { editable, tooltip, modelValue } = toRefs(props);
const value = computed({
  get: () => modelValue.value,
  set: (newValue) => {
    emit("update:modelValue", newValue);
  },
});
</script>

<template>
  <template v-if="editable">
    <template v-if="tooltip">
      <v-tooltip location="top">
        <template v-slot:activator="{ props: slotProps }">
          <v-text-field
            v-model="value"
            hide-details="auto"
            type="text"
            v-bind="slotProps"
            density="compact"
            v-if="!isArea"
            :disabled="disabled"
          ></v-text-field>
          <v-textarea
            v-model="value"
            hide-details="auto"
            v-bind="slotProps"
            density="compact"
            single-line
            :disabled="disabled"
            v-else
          ></v-textarea>
        </template>
        <span>{{ value }}</span>
      </v-tooltip>
    </template>
    <template v-else>
      <v-text-field
        v-model="value"
        hide-details="auto"
        type="text"
        density="compact"
        :disabled="disabled"
        v-if="!isArea"
      ></v-text-field>
      <v-textarea
        v-model="value"
        hide-details="auto"
        density="compact"
        single-line
        :disabled="disabled"
        v-else
      ></v-textarea>
    </template>
  </template>
  <template v-else>
    <template v-if="tooltip">
      <v-tooltip location="top">
        <template v-slot:activator="{ props: slotProps }">
          <span v-bind="slotProps" class="d-block text-right">
            {{ value }}
          </span>
        </template>
        <span>{{ value }}</span>
      </v-tooltip>
    </template>
    <template v-else>
      <span class="d-block text-right">
        {{ value }}
      </span>
    </template>
  </template>
</template>

<style scoped lang="sass"></style>
