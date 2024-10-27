import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'

const toast = useToast()

export const useToastStore = defineStore('toast', {
  actions: {
    showSuccess (message: string) {
      toast.success(message)
    },
    showError (message: string) {
      toast.error(message)
    },
    showInfo (message: string) {
      toast.info(message)
    },
    showWarning (message: string) {
      toast.warning(message)
    },
  },
})
