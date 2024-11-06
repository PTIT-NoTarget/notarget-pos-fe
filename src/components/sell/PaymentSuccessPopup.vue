<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  content?: string
  visible?: boolean
}>(), {
  title: 'Thanh toán thành công',
  content: '',
  visible: false,
})

const emit = defineEmits()

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
        <div style="display: flex; flex-direction: column;justify-content: center; align-items: center;">
          <v-icon color="success" size="100">mdi-check-circle</v-icon>
          <div class="text-h5 mt-3">{{ content }}</div>
        </div>

      </v-card-text>

      <v-card-actions>
        <v-btn color="success" border="success" @click="handleCancel" variant="outlined">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="sass">

</style>
