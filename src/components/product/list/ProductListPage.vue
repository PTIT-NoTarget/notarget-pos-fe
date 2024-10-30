<script setup lang="ts">
import { productService } from '@/services/ProductService'
import { viewService } from '@/services/ViewService'
import { debounce } from 'lodash'

const rowActions = ref<any[]>([
  {
    icon: 'pencil',
    label: '',
    action: (item: any) => {
    },
  },
  {
    icon: 'delete',
    label: '',
    action: (item: any) => {
    },
  },
])
const tableActions = ref<any[]>([
  {
    icon: 'import',
    label: 'Import',
    action: () => {
    },
  },
  {
    icon: 'export',
    label: 'Export',
    action: () => {
    },
  },
  {
    icon: 'plus-circle-outline',
    label: 'Thêm',
    action: () => {
    },
  },
  {
    icon: 'delete',
    label: 'Xóa',
    action: () => {
    },
  },
])
const headers = ref<any[]>([])
const items = ref<any[]>([])
const selected = ref<any[]>([])
const viewName = 'product_list'
const loading = ref<boolean>(false)
const filter = ref<any>({
  pageNumber: 1,
  pageSize: 20,
  common: '',
  filter: {},
})
const totalData = ref<number>(0)

onMounted(() => {
  loading.value = true
  viewService.getViewByViewName(viewName)
    .then((res: any) => {
      headers.value = res.data.data
      return productService.searchProduct(viewName, {
        ...filter.value,
        pageNumber: 0,
      })
    })
    .then((res: any) => {
      items.value = res.data.data
      totalData.value = res.data.data_count
    })
    .finally(() => {
      loading.value = false
    })

})

const getProductList = debounce(() => {
  loading.value = true
  productService.searchProduct(viewName, {
    ...filter.value,
    pageNumber: filter.value.pageNumber - 1,
  })
    .then((res: any) => {
      items.value = res.data.data
    })
    .finally(() => {
      loading.value = false
    })
}, 500)

watch(
  filter,
  () => {
    getProductList()
  },
  {
    deep: true,
  }
)


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
        :filter="filter"
        :have-filter="true"
        :total-data="totalData"
      />
    </v-col>
  </v-row>
</template>

<style scoped lang="sass">

</style>
