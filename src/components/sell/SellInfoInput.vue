<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    title: any;
    modelValue: any;
    editable?: boolean;
  }>(),
  {
    editable: false,
  }
);
const emit = defineEmits(["update:modelValue"]);
const value = computed({
  get: () => props.modelValue,
  set: (newValue) => {
    emit("update:modelValue", newValue);
  },
});
</script>

<template>
  <v-row>
    <v-col cols="4" class="flex align-content-center">
      <span>
        {{ title }}
      </span>
    </v-col>
    <v-col cols="8">
      <FloatNumberInput :editable="editable" :tooltip="false" v-model="value" />
    </v-col>
  </v-row>
</template>

<style scoped lang="sass"></style>
