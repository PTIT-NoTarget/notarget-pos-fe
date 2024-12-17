<script setup lang="ts">
import { CustomService } from '@/services/CustomService'
import { ProductService } from '@/services/ProductService'
import { useLoadingStore } from '@/stores/loading'
import { useToastStore } from '@/stores/toast'
import { DataType } from '@/utils/Constant'
import { debounce } from 'lodash'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    visible?: boolean;
    product?: any;
    forms: any[];
  }>(),
  {
    visible: false,
    product: {},
  }
);

const emit = defineEmits(["get-product-list", "update:visible", "update:product"]);

const productPopup = computed({
  get: () => props.visible,
  set: (newValue) => {
    emit("update:visible", newValue);
  },
});

const product = computed({
  get: () => props.product,
  set: (newValue) => {
    emit("update:product", newValue);
  },
});


const selectMap = ref<Map<string, any[]>>(new Map());
const isEmptyProduct = computed(() => {
  return Object.keys(product.value).length === 0;
});

const changeSelectMap = debounce((form: any, common: string = "") => {
  if (form["data_type"] === DataType.RELATION) {
    CustomService.getAutoComplete(
      form["relate_table"],
      form["relate_column"],
      common,
    ).then((res) => {
      selectMap.value.set(form["relate_table"], res.data.data);
    });
  }
}, 400);

const saveProduct = () => {
  useLoadingStore().showLoading();
  ProductService.saveProduct(product.value)
    .then(() => {
      productPopup.value = false;
      emit("get-product-list");
      useToastStore().showSuccess("Lưu sản phẩm thành công");
    })
    .finally(() => {
      useLoadingStore().hideLoading();
    });
};
const saveAndNewProduct = () => {
  useLoadingStore().showLoading();
  ProductService.saveProduct(product.value)
    .then(() => {
      emit("get-product-list");
      product.value = { is_new: true };
      useToastStore().showSuccess("Lưu sản phẩm thành công");
    })
    .finally(() => {
      useLoadingStore().hideLoading();
    });
};
const saveAndCopyProduct = () => {
  useLoadingStore().showLoading();
  ProductService.saveProduct(product.value)
    .then(() => {
      emit("get-product-list");
      product.value = {
        ...product.value,
        is_new: true,
        id: null,
      };
      useToastStore().showSuccess("Lưu sản phẩm thành công");
    })
    .finally(() => {
      useLoadingStore().hideLoading();
    });
};
</script>

<template>
  <v-dialog
    v-model="productPopup"
    width="auto"
    @after-leave="product = {}"
    :persistent="true"
  >
    <v-card width="1000">
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="text-h5 text-medium-emphasis ps-2">Thông tin sản phẩm</div>

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
        ></Form>
        <v-overlay
          :model-value="isEmptyProduct"
          class="align-center justify-center"
          contained
        >
          <v-progress-circular
            color="primary"
            size="64"
            indeterminate
          ></v-progress-circular>
        </v-overlay>
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" @click="productPopup = false" variant="text">
          Hủy
        </v-btn>
        <v-btn color="primary" @click="saveProduct" variant="elevated">
          Lưu
        </v-btn>
        <v-btn color="primary" @click="saveAndNewProduct" variant="elevated">
          Lưu và thêm mới
        </v-btn>
        <v-btn color="primary" @click="saveAndCopyProduct" variant="elevated">
          Lưu và sao chép
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="sass">

</style>
