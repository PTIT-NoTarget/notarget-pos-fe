<script setup lang="ts">

import { productService } from '@/services/ProductService'
import { debounce } from 'lodash'

const emit = defineEmits()
const selectedItem = ref<any>(null)
const searchResults = ref<any[]>([])
const searchQuery = ref<string>('')
const loading = ref<boolean>(false)
const viewName = 'product_list'

const handleSearchInput = async (val: any) => {
  searchQuery.value = val
  if (!val) return
  if (isPastedCode(val)) {
    await fetchByCode(val)
  } else {
    debouncedSearch(val)
  }
}

const handleSelect = (val: any) => {
  if (val) {
    setTimeout(() => {
      emit('add', val)
      selectedItem.value = null
      searchQuery.value = ''
      searchResults.value = []
    }, 100)
  }
}

const isPastedCode = (input: string) => {
  return false
}

const debouncedSearch = debounce(async (query: string) => {
  if (!query || query === '') {
    searchResults.value = []
    return
  }
  loading.value = true
  productService.searchProduct(
    viewName,
    {
      common: query,
    })
    .then((res: any) => {
      searchResults.value = res.data.data
    })
    .finally(() => {
      loading.value = false
    })
}, 400)

const fetchByCode = async (code: string) => {

}

const handleMenu = (val: boolean) => {
  if(searchQuery.value === '') {
    searchResults.value = []
  }
}

// watch(() => searchQuery.value, (val) => {
//   if (selectedItem.value && val !== '') {
//     setTimeout(() => {
//       selectedItem.value = null
//       searchQuery.value = ''
//       searchResults.value = []
//     }, 100)
//   }
//   else if(val === '') {
//     searchResults.value = []
//   }
// })

</script>

<template>
  <v-autocomplete
    v-model="selectedItem"
    :items="searchResults"
    :loading="loading"
    :search="searchQuery"
    item-value="id"
    item-title="product_name"
    clearable
    return-object
    autofocus
    hide-no-data
    no-filter
    variant="solo-filled"
    @update:search="handleSearchInput"
    @update:model-value="handleSelect"
    @update:menu="handleMenu"
  ></v-autocomplete>
</template>

<style scoped lang="sass">

</style>
