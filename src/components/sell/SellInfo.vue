<script setup lang="ts">
import {Enum} from "@/utils/Enum";
import {debounce} from "lodash";
import {DataType} from "@/utils/Constant";
import {CustomService} from "@/services/CustomService";

const props = withDefaults(defineProps<{
  info: any
  forms: any
}>(), {})
const emit = defineEmits();
const formViewName: string[] = ['sell_order_info', 'sell_order_calc', 'sell_order_payment']
const selectMap = ref<Map<string, any[]>>(new Map())

const modelInfo = computed({
  get: () => props.info,
  set: (newValue) => {
    emit('update:info', newValue)
  }
})

onUpdated(() => {
  if (!props.info['payment']) {
    props.info['payment'] = Enum['payment'].CASH.value
  }
})

const changeSelectMap = debounce((form: any, common: string = '') => {
  if (form['data_type'] === DataType.RELATION) {
    CustomService.getAutoComplete(form['relate_table'], form['relate_column'], common)
      .then((res) => {
        selectMap.value.set(form['relate_table'], res.data.data)
      })
  }
}, 400)

const qrCodeUrl = computed(() => {
  return `https://img.vietqr.io/image/mbbank-3806062003-qr_only.jpg?amount=${modelInfo.value['final_total']}&addInfo=${modelInfo.value['payment_id']}&accountName=QUAN%20CO%20VAN%20SUU`;
});

const handlePayment = () => {
  emit('submit:payment')
}

</script>

<template>
  <div style="height:100%; display: flex; flex-direction: column; justify-content: space-between; padding-top: 12px">
    <div>
      <div class="text-h4 text-center mb-3">Thông tin đơn hàng</div>
      <Form
        v-model:item="modelInfo"
        :forms="forms[formViewName[0]]"
        :line-each-item="1"
        :column-number="1"
        :tooltip="false"
        :select-map="selectMap"
        @update:change-select-map="changeSelectMap"
      />
      <v-divider class="my-3"></v-divider>
      <div class="text-h4 text-center mb-3">Tính tiền</div>
      <Form
        v-model:item="modelInfo"
        :forms="forms[formViewName[1]]"
        :line-each-item="1"
        :column-number="1"
        :tooltip="false"
      />
      <v-divider class="my-3"></v-divider>
      <Form
        v-model:item="modelInfo"
        :forms="forms[formViewName[2]]"
        :line-each-item="1"
        :column-number="1"
        :tooltip="false"
      />
      <template v-if="modelInfo['payment'] && modelInfo['payment'] === Enum['payment']['TRANSFER'].value">
        <v-img
          :src="qrCodeUrl"
          width="200"
          height="200"
          class="mx-auto mt-3"
        />
        <div class="text-center">3806062003</div>
        <div class="text-center">NGO DANG HAN</div>
      </template>
    </div>
    <div>
      <v-row>
        <v-col cols="4" style="display: flex" class="justify-center align-center">
          <v-btn color="primary" icon size="80px" :rounded="false" block>
            <v-icon size="40px">mdi-printer</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="8">
          <v-btn
            color="primary"
            text="Thanh toán"
            block
            size="80px"
            :rounded="false"
            @click="handlePayment"
            :loading="modelInfo['is_paid']"
          ></v-btn>
        </v-col>
      </v-row>
    </div>
  </div>


</template>

<style scoped lang="sass">

</style>
