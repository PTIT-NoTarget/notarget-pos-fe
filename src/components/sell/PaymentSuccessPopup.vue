<script lang="ts" setup>
import { PaymentService } from "@/services/PaymentService";
import { Enum } from "@/utils/Enum";
import { debounce } from "lodash";

const props = withDefaults(
  defineProps<{
    visible?: any;
    info?: any;
  }>(),
  {
    content: "",
    visible: false,
  },
);

const title = ref<string>("Thanh toán thành công");
const emit = defineEmits();
const paymentStatus = ref<string>("");

watch(
  () => props.visible,
  (newValue) => {
    if (newValue["payment"] === Enum["payment"]["CASH"].value) {
      paymentStatus.value = Enum["payment_status"]["PAID"].value;
      title.value = "Thanh toán thành công";
      return;
    }
    if (newValue["payment"] === Enum["payment"]["TRANSFER"].value) {
      if (newValue.payment_status === Enum["payment_status"]["PAID"].value) {
        checkPayment();
      } else {
        paymentStatus.value = Enum["payment_status"]["PENDING"].value;
        title.value = "Thanh toán chờ xác nhận";
      }
    }
  },
  {
    deep: true,
    immediate: true,
  },
);

const modelVisible = computed({
  get: () => props.visible,
  set: (newValue) => {
    emit("update:visible", newValue);
  },
});

const handleCancel = () => {
  modelVisible.value.visible = false;
  if (paymentStatus.value === Enum["payment_status"]["PAID"].value) {
    emit("submit", props.info.tabId);
  }
};

const qrCodeUrl = computed(() => {
  return `https://img.vietqr.io/image/mbbank-VQRQAAVMM8786-qr_only.jpg?amount=${props.info["final_total"]}&addInfo=${props.info["payment_uid"]}&accountName=QUAN%20CO%20VAN%20SUU`;
});

const checkBtnLoading = ref<boolean>(false);
const checkPayment = () => {
  checkBtnLoading.value = true;
  PaymentService.check(props.info["payment_uid"])
    .then(() => {
      paymentStatus.value = Enum["payment_status"]["PAID"].value;
      title.value = "Thanh toán thành công";
    })
    .catch(() => {
      paymentStatus.value = Enum["payment_status"]["PENDING"].value;
      title.value = "Thanh toán chờ xác nhận";
    })
    .finally(() => {
      checkBtnLoading.value = false;
    });
};
</script>

<template>
  <v-dialog v-model="modelVisible.visible" :persistent="true" width="auto">
    <v-card :title="title" width="500">
      <v-card-text>
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          "
        >
          <template
            v-if="modelVisible.payment === Enum['payment']['CASH'].value"
          >
            <v-icon color="success" size="100">mdi-check-circle</v-icon>
            <div class="text-h5 mt-3">
              {{ info.name }} đã thanh toán thành công
            </div>
          </template>
          <template
            v-else-if="
              modelVisible.payment === Enum['payment']['TRANSFER'].value
            "
          >
            <template
              v-if="paymentStatus === Enum['payment_status']['PAID'].value"
            >
              <v-icon color="success" size="100">mdi-check-circle</v-icon>
              <div class="text-h5 mt-3">{{ info.name }} đã thanh toán thành công</div>
            </template>
            <template
              v-else-if="
                paymentStatus === Enum['payment_status']['PENDING'].value
              "
            >
              <v-img
                :src="qrCodeUrl"
                class="mx-auto mt-3"
                height="200"
                width="200"
              />
              <div class="text-center">3806062003</div>
              <div class="text-center">NGO DANG HAN</div>
            </template>
          </template>
        </div>
      </v-card-text>

      <v-card-actions>
        <div class="w-100 d-flex justify-center align-center mb-3">
          <v-btn
            color="success"
            variant="elevated"
            width="100"
            @click="handleCancel"
          >
            OK
          </v-btn>
          <v-btn
            :loading="checkBtnLoading"
            v-if="
              modelVisible.payment === Enum['payment']['TRANSFER'].value &&
              paymentStatus === Enum['payment_status']['PENDING'].value
            "
            class="ml-3"
            color="warning"
            variant="outlined"
            width="100"
            @click="checkPayment"
          >
            Kiểm tra
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="sass" scoped></style>
