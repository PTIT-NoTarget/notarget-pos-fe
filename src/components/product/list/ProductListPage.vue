<script setup lang="ts">
import { productService } from '@/services/ProductService'
import { viewService } from '@/services/ViewService'

const rowActions = ref<any[]>([
  {
    icon: 'pencil',
    label: '',
    action: (item: any) => {},
  },
  {
    icon: 'delete',
    label: '',
    action: (item: any) => {},
  },
])
const tableActions = ref<any[]>([
  {
    icon: 'plus',
    label: 'Thêm',
    action: () => {},
  },
  {
    icon: 'delete',
    label: 'Xóa',
    action: () => {},
  },
])
const headers = ref<any[]>([])
const items = ref<any[]>([])
const selected = ref<any[]>([])
const viewName = 'product_list'
const loading = ref<boolean>(false)

onMounted(() => {
  loading.value = true
  viewService.getViewByViewName(viewName)
    .then((res: any) => {
      headers.value = res.data.data
      return productService.searchProduct(viewName, {
        pageNumber: 0,
        pageSize: 20,
      })
    })
    .then((res: any) => {
      items.value = res.data.data
    })
    .finally(() => {
      loading.value = false
    })
})



</script>

<template>
  <v-row style="width: 100%;height: calc(100vh - 48px);padding: 8px">
    <v-col cols="2">

    </v-col>
    <v-col cols="10">
      <Table
        :height="850"
        :columns="headers"
        :items="items"
        :row-actions="rowActions"
        :highlight-row="true"
        :have-pagination="true"
        :show-selected="true"
        :selected.sync="selected"
        :loading="loading"
        :table-actions="tableActions"
        :show-search="true"
      />
    </v-col>
  </v-row>
</template>

<style scoped lang="sass">

</style>
