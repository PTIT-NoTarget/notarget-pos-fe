<script setup lang="ts">
import { ExcelService } from '@/services/ExcelService'
import { ProductService } from '@/services/ProductService'
import { ViewService } from '@/services/ViewService'
import { useToastStore } from '@/stores/toast'
import { debounce } from 'lodash'

const rowActions = ref<any[]>([
  {
    icon: 'pencil',
    label: '',
    action: (item: any) => openEditPopup(item),
  },
  {
    icon: 'delete',
    label: '',
    action: (item: any) => deleteProduct(item)
  },
])
const tableActions = ref<any[]>([
  {
    icon: 'import',
    label: 'Import',
    action: () => openPopupImport(),
  },
  {
    icon: 'export',
    label: 'Export',
    action: () => exportProduct(),
  },
  {
    icon: 'plus-circle-outline',
    label: 'Thêm',
    action: () => openAddPopup(),
  },
  {
    icon: 'delete',
    label: 'Xóa',
    action: () => deleteMultiProduct(),
  },
])
const headers = ref<any[]>([])
const items = ref<any[]>([])
const selected = ref<any[]>([])
const viewName = 'product_list'
const formViewName = 'product_form_popup'
const loading = ref<boolean>(false)
const filter = ref<any>({
  pageNumber: 1,
  pageSize: 20,
  common: '',
  filter: {},
})
const totalData = ref<number>(0)
const productPopup = ref<boolean>(false)
const forms = ref<any[]>([])
const product = ref<any>({})
const selectMap = ref<Map<string, any[]>>(new Map())

onMounted(() => {
  loading.value = true
  ViewService.getViewByMultiViewName([viewName, formViewName])
    .then((res: any) => {
      headers.value = res.data.data[viewName]
      forms.value = res.data.data[formViewName]
      return ProductService.searchProduct(viewName, {
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
  ProductService.searchProduct(viewName, {
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

const deleteProduct = (item: any) => {
  ProductService.deleteProduct(item.id)
    .then(() => {
      getProductList()
      useToastStore().showSuccess('Xóa sản phẩm thành công')
    })
}

const deleteMultiProduct = () => {
  if(selected.value.length === 0) {
    useToastStore().showWarning('Chưa chọn sản phẩm để xóa')
    return
  }
  ProductService.deleteMultiProduct(selected.value)
    .then(() => {
      getProductList()
      useToastStore().showSuccess('Xóa sản phẩm thành công')
    })
    .finally(() => {
      selected.value = []
    })
}

const openAddPopup = () => {
  productPopup.value = true
}

const openEditPopup = (item: any) => {
  ProductService.getProduct(item.id)
    .then((res: any) => {
      product.value = res.data.data
      productPopup.value = true
    })
}

const exportProduct = () => {
  ExcelService.exportExcel(viewName)
    .then((res) => {
      const url = window.URL.createObjectURL(
        new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "export.xlsx");
      document.body.appendChild(link);
      link.click();
      useToastStore().showSuccess("Export thành công");
    })
    .catch(() => {
      useToastStore().showError("Export thất bại");
    })
    .finally(() => {
    });
}

const openPopupImport = () => {
  useToastStore().showWarning('Chức năng đang phát triển')
}

watch(
  filter,
  () => {
    getProductList()
  },
  {
    deep: true,
  }
)

watch(
  product,
  () => {
    console.log(product.value)
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
        v-model:selected="selected"
        :loading="loading"
        :table-actions="tableActions"
        :show-search="true"
        :filter="filter"
        :have-filter="true"
        :total-data="totalData"
      />
    </v-col>
  </v-row>
  <v-dialog
    v-model="productPopup"
    width="auto"
    @after-leave="product = {}"
  >
    <v-card
      width="1000"
      title="Thông tin sản phẩm"
    >
      <v-card-text>
        <Form
          v-model:item="product"
          :forms="forms"
          :line-each-item="2"
          :column-number="2"
          :tooltip="false"
          :select-map="selectMap"
        />
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" @click="productPopup = false" variant="text">Hủy</v-btn>
        <v-btn color="primary" @click="productPopup = false" variant="elevated">Lưu</v-btn>
        <v-btn color="primary" @click="productPopup = false" variant="elevated">Lưu và thêm mới</v-btn>
        <v-btn color="primary" @click="productPopup = false" variant="elevated">Lưu và đóng</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="sass">

</style>
