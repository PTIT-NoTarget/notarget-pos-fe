<script setup lang="ts">
import {ProductService} from "@/services/ProductService";
import axios from "axios";
import {ViewService} from "@/services/ViewService";
import {useLoadingStore} from "@/stores/loading";

const props = withDefaults(defineProps<{
  selected: any[]
}>(), {
  selected: () => [],
});
const emit = defineEmits();
const modelSelected = computed({
  get: () => props.selected,
  set: (newValue) => {
    emit('update:selected', newValue);
  }
});
const productTypeList = ref<any[]>([])
const viewName = "group_product_type";
const expanded = ref([0]);
const addProductTypePopup = ref<boolean>(false);
const productType = ref<any>({});
const forms = ref<any[]>([]);
const loading = ref<boolean>(false);

onMounted(() => {
  axios.all([
    ViewService.getViewByViewName(viewName),
    ProductService.searchProductType(viewName, {
      filter: {},
      sort_property: "id",
      sort_order: "asc",
    })
  ])
    .then(axios.spread((viewRes, prodRes) => {
      forms.value = viewRes.data.data;
      productTypeList.value = prodRes.data.data
    }))
    .finally(() => {
      useLoadingStore().hideLoading();
    })
})

const handleSelectRow = (event: Event, item: any) => {
  const checked = (event.target as HTMLInputElement).checked
  console.log('checked', checked)
  if (checked) {
    modelSelected.value.push(item.id)
  } else {
    const index = modelSelected.value.indexOf(item.id);
    if (index !== -1) {
      modelSelected.value.splice(index, 1);
    }
  }
}

const saveProductType = () => {
  loading.value = true
  ProductService.saveProductType(productType.value)
    .then(() => {
      addProductTypePopup.value = false
      return ProductService.searchProductType(viewName, {
        filter: {},
        sort_property: "id",
        sort_order: "asc",
      })
    })
    .then((res: any) => {
      productTypeList.value = res.data.data
    })
    .finally(() => {
      loading.value = false
    })
}

</script>

<template>
  <v-expansion-panels v-model="expanded">
    <v-expansion-panel
      title="Loại hàng hoá"
      height="48"
    >
      <v-expansion-panel-text>
        <template v-for="item in productTypeList">
          <v-checkbox
            :model-value="modelSelected.includes(item.id)"
            :label="item.type_name"
            hide-details
            density="compact"
            @change="(e : any) => handleSelectRow(e, item)"
          ></v-checkbox>
        </template>
        <v-btn
          style="width: 100%"
          color="primary"
          variant="text"
          @click="() => addProductTypePopup = true"
          block
          prepend-icon="mdi-plus"
          text="Thêm loại hàng hoá"
        ></v-btn>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
  <v-dialog
    v-model="addProductTypePopup"
    width="auto"
    @after-leave="productType = {}"
  >
    <v-card
      width="600"
      title="Thông tin loại sản phẩm"
    >
      <v-card-text>
        <Form
          v-model:item="productType"
          :forms="forms"
          :line-each-item="2"
          :column-number="1"
          :tooltip="false"
        />
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" @click="addProductTypePopup = false" variant="text">Hủy</v-btn>
        <v-btn color="primary" @click="saveProductType" variant="elevated">Lưu</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-overlay :model-value="loading" class="align-center justify-center" contained>
    <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
  </v-overlay>
</template>

<style lang="sass">
.v-expansion-panel-text__wrapper
  padding: 0 8px !important

.v-expansion-panel-text
  max-height: 400px
  overflow-y: auto
</style>
