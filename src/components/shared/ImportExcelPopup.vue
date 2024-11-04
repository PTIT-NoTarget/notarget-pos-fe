<script setup lang="ts">
import {useToastStore} from "@/stores/toast";
import {ImageService} from "@/services/ImageService";

const props = withDefaults(defineProps<{
  title?: string
  visible?: boolean
}>(), {
  title: '',
  visible: false,
})

const emit = defineEmits()

const modelVisible = computed({
  get: () => props.visible,
  set: (newValue) => {
    emit('update:visible', newValue)
  }
})

const get = () => {
  emit('get')
}

const submit = () => {
  emit('import', file.value)
}

const handleCancel = () => {
  modelVisible.value = false
}

const file = ref<any>(null)
const handleFileUpload = (event: any) => {
  const req = event.target.files[0]
  if (!req) {
    useToastStore().showWarning('Vui lòng chọn file')
    return
  }
  file.value = req
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
      <v-card-text style="display: flex;flex-direction:column;justify-content: center;align-items: center">
        <v-file-input
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          @change="handleFileUpload"
          hide-details="auto"
          density="compact"
          width="100%"
        ></v-file-input>
        <v-btn value="text" @click="get" width="100" class="mt-2">Tải mẫu</v-btn>
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" border="primary" @click="handleCancel" variant="outlined">Hủy</v-btn>
        <v-btn color="primary" border="primary" @click="submit" variant="elevated">Xác nhận</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="sass">

</style>
