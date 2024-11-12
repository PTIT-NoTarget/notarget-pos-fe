<script setup lang="ts">
import {ExcelService} from '@/services/ExcelService'
import {ProductService} from '@/services/ProductService'
import {ViewService} from '@/services/ViewService'
import {useToastStore} from '@/stores/toast'
import {useLoadingStore} from '@/stores/loading';
import {debounce} from 'lodash'
import {DataType} from "@/utils/Constant";
import {CustomService} from "@/services/CustomService";
import axios from "axios";

const rowActions = ref<any[]>([
  {
    icon: 'pencil',
    label: '',
    action: (item: any) => openEditPopup(item),
  },
  {
    icon: 'delete',
    label: '',
    action: (item: any) => openDeletePopup(item)
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
    action: () => openDeleteMultiPopup(),
  },
])
const headers = ref<any[]>([])
const items = ref<any[]>([])
const selected = ref<any[]>([])
const productTypeSelected = ref<any[]>([])
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
const forms = ref<any[]>([])
const product = ref<any>({})
const selectMap = ref<Map<string, any[]>>(new Map())

onMounted(() => {
  useLoadingStore().showLoading()
  axios.all([
    ViewService.getViewByMultiViewName([viewName, formViewName]),
    ProductService.searchProduct(viewName, {
      ...filter.value,
      pageNumber: 0,
    })
  ])
    .then(axios.spread((viewRes, prodRes) => {
      headers.value = viewRes.data.data[viewName];
      forms.value = viewRes.data.data[formViewName];

      items.value = prodRes.data.data;
      totalData.value = prodRes.data.data_count;
    }))
    .finally(() => {
      useLoadingStore().hideLoading();
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
      totalData.value = res.data.data_count
    })
    .finally(() => {
      loading.value = false
    })
}, 500)

const deletePopup = ref<boolean>(false)
const deleteItem = ref<any>({})
const openDeletePopup = (item: any) => {
  deleteItem.value = item
  deletePopup.value = true
}
const deleteProduct = () => {
  ProductService.deleteProduct(deleteItem.value.id)
    .then(() => {
      getProductList()
      useToastStore().showSuccess('Xóa sản phẩm thành công')
      deletePopup.value = false
    })
}

const deleteMultiPopup = ref<boolean>(false)
const openDeleteMultiPopup = () => {
  if (selected.value.length === 0) {
    useToastStore().showWarning('Chưa chọn sản phẩm để xóa')
    return
  }
  deleteMultiPopup.value = true
}
const deleteMultiProduct = () => {
  if (selected.value.length === 0) {
    useToastStore().showWarning('Chưa chọn sản phẩm để xóa')
    return
  }
  ProductService.deleteMultiProduct(selected.value)
    .then(() => {
      getProductList()
      useToastStore().showSuccess('Xóa sản phẩm thành công')
      deleteMultiPopup.value = false
    })
    .finally(() => {
      selected.value = []
    })
}

const productPopup = ref<boolean>(false)
const isEmptyProduct = computed(() => {
  return Object.keys(product.value).length === 0
})
const openAddPopup = () => {
  product.value = { is_new: true }
  productPopup.value = true
}
const openEditPopup = (item: any) => {
  productPopup.value = true
  ProductService.getProduct(item.id)
    .then((res: any) => {
      product.value = res.data.data
    })
    .catch(() => {
      productPopup.value = false
    })
}

const exportProduct = () => {
  useLoadingStore().showLoading()
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
    .finally(() => {
      useLoadingStore().hideLoading();
    });
}

const changeSelectMap = debounce((form: any, common: string = '') => {
  if (form['data_type'] === DataType.RELATION) {
    CustomService.getAutoComplete(form['relate_table'], form['relate_column'], common)
      .then((res) => {
        selectMap.value.set(form['relate_table'], res.data.data)
      })
  }
}, 400)

const saveProduct = () => {
  productPopup.value = false
  ProductService.saveProduct(product.value)
    .then(() => {
      getProductList()
      useToastStore().showSuccess('Lưu sản phẩm thành công')
    })
}
const saveAndNewProduct = () => {
  ProductService.saveProduct(product.value)
    .then(() => {
      getProductList()
      product.value = { is_new: true }
      useToastStore().showSuccess('Lưu sản phẩm thành công')
    })
}
const saveAndCopyProduct = () => {
  ProductService.saveProduct(product.value)
    .then(() => {
      getProductList()
      product.value = {
        ...product.value,
        is_new: true,
        id: null,
      }
      useToastStore().showSuccess('Lưu sản phẩm thành công')
    })

}

const importPopup = ref<boolean>(false)
const openPopupImport = () => {
  importPopup.value = true
}
const importExcel = (file: any) => {
  useLoadingStore().showLoading()
  ExcelService.importExcel(formViewName, file)
    .then(() => {
      getProductList()
      useToastStore().showSuccess('Import thành công')
    })
    .finally(() => {
      useLoadingStore().hideLoading()
    })
}
const getExcelTemplate = () => {
  useLoadingStore().showLoading()
  ExcelService.getExcelTemplate(formViewName)
    .then((res) => {
      const url = window.URL.createObjectURL(
        new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "import.xlsx");
      document.body.appendChild(link);
      link.click();
      useToastStore().showSuccess("Tải mẫu thành công");
    })
    .finally(() => {
      useLoadingStore().hideLoading()
    })
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
  productTypeSelected,
  () => {
    filter.value.filter = {
      ...filter.value.filter,
      product_type_id: productTypeSelected.value.length > 0 ? {
        value: productTypeSelected,
        operator: "in",
      } : undefined
    }
  },
  {
    deep: true,
  }
)
</script>

<template>
  <v-row style="width: 100%;height: calc(100vh - 48px);padding: 8px">
    <v-col cols="2" style="position: relative;">
      <LeftSide
        :selected="productTypeSelected"
      />
    </v-col>
    <v-col cols="10">
      <Table
        :height="800"
        :columns="headers"
        :items="items"
        :row-actions="rowActions"
        :highlight-row="true"
        :have-pagination="true"
        :show-selected="true"
        v-model:selected="selected"
        v-model:loading="loading"
        :table-actions="tableActions"
        :show-search="true"
        :filter="filter"
        :have-filter="true"
        :total-data="totalData"
        @handle-row-click="openEditPopup"
      />
    </v-col>
  </v-row>
  <v-dialog
    v-model="productPopup"
    width="auto"
    @after-leave="product = {}"
    :persistent="true"
  >
    <v-card width="1000">
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="text-h5 text-medium-emphasis ps-2">
          Thông tin sản phẩm
        </div>

        <v-btn
          icon="mdi-close"
          variant="text"
          @click="productPopup = false"
        ></v-btn>
      </v-card-title>
      <v-card-text style="position: relative">
        <Form
          v-model:item="product"
          :forms="forms"
          :line-each-item="2"
          :column-number="2"
          :tooltip="false"
          :select-map="selectMap"
          @update:change-select-map="changeSelectMap"
        />
        <v-overlay :model-value="isEmptyProduct" class="align-center justify-center" contained>
          <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
        </v-overlay>
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" @click="productPopup = false" variant="text">Hủy</v-btn>
        <v-btn color="primary" @click="saveProduct" variant="elevated">Lưu</v-btn>
        <v-btn color="primary" @click="saveAndNewProduct" variant="elevated">Lưu và thêm mới</v-btn>
        <v-btn color="primary" @click="saveAndCopyProduct" variant="elevated">Lưu và sao chép</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <ConfirmPopup
    v-model:visible="deletePopup"
    title="Xác nhận"
    content="Bạn có chắc chắn muốn xóa sản phẩm này không?"
    type="error"
    @submit="deleteProduct"
  />
  <ConfirmPopup
    v-model:visible="deleteMultiPopup"
    title="Xác nhận"
    content="Bạn có chắc chắn muốn xóa những sản phẩm đã chọn không?"
    type="error"
    @submit="deleteMultiProduct"
  />
  <ImportExcelPopup
    v-model:visible="importPopup"
    title="Import sản phẩm"
    @import="importExcel"
    @get="getExcelTemplate"
  ></ImportExcelPopup>
</template>

<style scoped lang="sass">


</style>
