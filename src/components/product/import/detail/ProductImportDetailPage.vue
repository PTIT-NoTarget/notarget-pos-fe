<script setup lang="ts">

import { ViewService } from '@/services/ViewService'

const productFormViewName: string = 'product_form_popup'
const viewName: string = 'product_import_detail_list'
const formViewName: string[] = ['entry_form_info', 'entry_form_detail']
const headers = ref<any[]>([]);
const forms = ref<any>(undefined);
const productForm = ref<any>(undefined);
const rowActions = ref<any[]>([
  {
    icon: "delete",
    label: "",
    action: (item: any) => remove(item),
  },
]);
const items = ref<any[]>([]);

onMounted(() => {
  ViewService.getViewByMultiViewName([viewName, ...formViewName, productFormViewName]).then(
    (res: any) => {
      headers.value = res.data.data[viewName] || [];
      forms.value = formViewName.reduce((acc: any, name: string) => {
        acc[name] = res.data.data[name] || [];
        return acc;
      }, {});
      productForm.value = res.data.data[productFormViewName] || [];
    },
  );
});

const newProduct = ref<any>({});
const newProductPopup = ref<boolean>(false);
const openAddPopup = () => {
  newProduct.value = { is_new: true };
  newProductPopup.value = true;
};

const remove = (item: any) => {
  items.value = items.value.filter((i) => i.id !== item.id);
};

</script>

<template>
  <div class="text-h5 text-center font-weight-bold">
    Phiếu nhập hàng
  </div>
  <v-row style="height: calc(100% - 100px)">
    Hello
    <v-col cols="8" style="height: 100%">
      <div>
        <v-btn @click="openAddPopup" color="primary">Thêm sản phẩm</v-btn>
      </div>
      <Table
        :columns="headers"
        :items="items"
        :row-actions="rowActions"
        :highlight-row="false"
        :have-pagination="false"
      ></Table>
    </v-col>
    <v-col cols="4" style="height: 100%">
      <ProductImportDetailInfo />
    </v-col>
  </v-row>
  <ProductDetailPopup
    v-model:visible="newProductPopup"
    v-model:product="newProduct"
    :forms="productForm"
  />
</template>

<style scoped lang="sass">

</style>
