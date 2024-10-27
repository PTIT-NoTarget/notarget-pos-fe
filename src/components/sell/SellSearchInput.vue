<script setup lang="ts">

import { productService } from '@/services/ProductService'
import { debounce } from 'lodash'

const emit = defineEmits()
const selectedItem = ref<any>(null)
const searchResults = ref<any[]>([])
const searchQuery = ref<string>('')
const typingCount = ref<number>(0)
const loading = ref<boolean>(false)
const viewName = 'product_list'

const handleSelect = (val: any) => {
  if (val) {
    emit('add', val)
    selectedItem.value = null
    searchQuery.value = ''
    searchResults.value = []
  }
}

const debouncedSearch = debounce((query: string) => {
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

watch(() => searchQuery.value, (newVal: string, oldValue: string) => {
  console.log('newVal: ', newVal)
  if (newVal.length > oldValue.length) {
    typingCount.value++
  }
  if (newVal.length < oldValue.length) {
    typingCount.value = typingCount.value > 0 ? typingCount.value - 1 : 0
  }
  typingCount.value = newVal.length === 0 ? 0 : typingCount.value
  if (newVal !== '') {
    if (typingCount.value < newVal.length) {
      productService.getProductByCode(newVal)
        .then((res: any) => {
          emit('add', res.data.data)
        })
        .finally(() => {
          selectedItem.value = null
          searchQuery.value = ''
          searchResults.value = []
          typingCount.value = 0
        })
    } else {
      debouncedSearch(newVal)
    }
  } else {
    searchResults.value = []
  }
})

</script>

<template>
  <v-autocomplete
    v-model="selectedItem"
    :items="searchResults"
    :loading="loading"
    :search="searchQuery"
    item-value="id"
    item-title="product_code"
    clearable
    return-object
    autofocus
    hide-no-data
    no-filter
    hide-details="auto"
    append-inner-icon="mdi-magnify"
    prepend-icon=""
    variant="solo-filled"
    density="comfortable"
    @update:search="searchQuery = $event"
    @blur="searchQuery = ''"
    @select="handleSelect"

  >
    <template v-slot:item="{ props, item }">
      <v-list-item v-bind="props">
        <template v-slot:prepend>
          <v-img
            :src="item.raw.product_image"
            width="100"
            height="100"
            cover
            class="mr-3"
          ></v-img>
        </template>
        <v-list-item-title class="text-h5">{{ item.raw.product_name }}</v-list-item-title>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<style lang="sass">
.v-autocomplete__menu-icon
  display: none

.v-autocomplete__content
  max-height: 800px !important

</style>
