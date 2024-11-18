<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string;
    content?: string;
    alert?: string;
    visible?: boolean;
    type?: string;
  }>(),
  {
    title: "",
    content: "",
    visible: false,
    type: "primary",
  },
);

const emit = defineEmits();

const submit = () => {
  emit("submit");
};

const modelVisible = computed({
  get: () => props.visible,
  set: (newValue) => {
    emit("update:visible", newValue);
  },
});

const handleCancel = () => {
  modelVisible.value = false;
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    handleCancel();
  } else if (event.key === "Enter") {
    submit();
  }
};
</script>

<template>
  <v-dialog @keydown="handleKeyDown" v-model="modelVisible" width="auto" :persistent="true">
    <v-card width="500">
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="text-h5 text-medium-emphasis ps-2">
          {{ title }}
        </div>

        <v-btn icon="mdi-close" variant="text" @click="handleCancel"></v-btn>
      </v-card-title>
      <v-card-text>
        <div class="mb-3">
          {{ content }}
        </div>
        <v-alert
          v-if="alert && alert.length > 0"
          :type="type"
          variant="outlined"
          title="Lưu ý"
        >
          {{ alert }}
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-btn
          :color="type"
          :border="type"
          @click="handleCancel"
          variant="outlined"
        >
          Hủy
        </v-btn>
        <v-btn :color="type" :border="type" @click="submit" variant="elevated">
          Xác nhận
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="sass"></style>
