<script setup lang="ts">
const props = withDefaults(defineProps<{
  info: any
}>(), {})

const paymentMethods: any[] = [
  {
    id: 'tienmat',
    label: 'Tiền mặt',
    isDefault: true,
  },
  {
    id: 'chuyenkhoan',
    label: 'Chuyển khoản',
  },
]

onMounted(() => {
  if (!props.info['payment']) {
    props.info['payment'] = paymentMethods.find((item) => item.isDefault)
  }
})

</script>

<template>
  <div style="height:100%; display: flex; flex-direction: column; justify-content: space-between; padding-top: 12px">
    <div>
      <div class="text-h4 text-center mb-3">Thông tin đơn hàng</div>
      <SellInfoSelect title="Khách hàng :" v-model="info['customer']" :list="[{id: -1}]" label="customer_name"/>
      <SellInfoSelect title="Nhân viên :" v-model="info['employee']" :list="[{id: -1}]" label="employee_name"/>
      <v-divider class="my-3"></v-divider>
      <div class="text-h4 text-center mb-3">Tính tiền</div>
      <SellInfoInput title="Tổng tiền :" v-model="info['total']"/>
      <SellInfoInput title="Chiết khấu :" v-model="info['discount']" :editable="true"/>
      <SellInfoInput title="Thành tiền :" v-model="info['final']"/>
      <v-divider class="my-3"></v-divider>
      <SellInfoSelect title="Hình thức chuyển khoản :" v-model="info['payment']" :list="paymentMethods"/>
      <template v-if="info['payment'] && info['payment'].id === 'chuyenkhoan'">
        <v-img
          :src="'https://img.vietqr.io/image/mbbank-3806062003-qr_only.jpg?amount=5000&addInfo=Ngo%20Dang%20Han&accountName=NGO%20DANG%20HAN'"
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
          <v-btn color="primary" text="Thanh toán" block size="80px" :rounded="false">
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </div>


</template>

<style scoped lang="sass">

</style>
