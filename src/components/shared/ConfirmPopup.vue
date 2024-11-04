<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  content?: string
  visible?: boolean
  type?: string
}>(), {
  title: '',
  content: '',
  visible: false,
  type: 'primary',
})

const emit = defineEmits()

const submit = () => {
  emit('submit')
}

const modelVisible = computed({
  get: () => props.visible,
  set: (newValue) => {
    emit('update:visible', newValue)
  }
})

const handleCancel = () => {
  modelVisible.value = false
}

</script>

<template>
  <v-dialog
    v-model="modelVisible"
    width="auto"
  >
    <v-card
      width="500"
      :title="title"
    >
      <v-card-text>
        {{ content }}
      </v-card-text>

      <v-card-actions>
        <v-btn :color="type" :border="type" @click="handleCancel" variant="outlined">Hủy</v-btn>
        <v-btn :color="type" :border="type" @click="submit" variant="elevated">Xác nhận</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="sass">

</style>
