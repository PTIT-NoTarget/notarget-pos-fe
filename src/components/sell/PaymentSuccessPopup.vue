<script lang="ts" setup>
import { PaymentService } from "@/services/PaymentService";
import { Enum } from "@/utils/Enum";

const props = withDefaults(
  defineProps<{
    visible: boolean;
    info?: any;
    check?: boolean;
  }>(),
  {
    info: {},
    check: false,
  },
);

const emit = defineEmits();
const paymentStatus = computed({
  get: () => props.info.payment_status,
  set: (newValue) => {
    emit("update:info", {
      ...props.info,
      payment_status: newValue,
    });
  },
});

watch(
  () => props.check,
  (newValue) => {
    if (newValue) {
      checkPayment();
    }
  },
  {
    deep: true,
  },
);

const title = computed(() => {
  if (paymentStatus.value === Enum["payment_status"]["PENDING"].value) {
    return "Thanh toán chờ xác nhận";
  }
  return "Thanh toán thành công";
});

const modelVisible = computed({
  get: () => props.visible,
  set: (newValue) => {
    emit("update:visible", newValue);
  },
});

const handleCancel = () => {
  modelVisible.value = false;
  if (paymentStatus.value === Enum["payment_status"]["PAID"].value) {
    emit("submit", props.info["payment_uid"]);
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
      modelVisible.value = true;
      paymentStatus.value = Enum["payment_status"]["PAID"].value;
    })
    .catch(() => {
      paymentStatus.value = Enum["payment_status"]["PENDING"].value;
    })
    .finally(() => {
      checkBtnLoading.value = false;
    });
};
</script>

<template>
  <v-dialog v-model="modelVisible" :persistent="true" width="auto">
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
            v-if="info.payment === Enum['payment']['CASH'].value"
          >
            <v-icon color="success" size="100">mdi-check-circle</v-icon>
            <div class="text-h5 mt-3">
              {{ info.name }} đã thanh toán thành công
            </div>
          </template>
          <template
            v-else-if="
                    info.payment === Enum['payment']['TRANSFER'].value
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
            v-if="
                    info.payment === Enum['payment']['TRANSFER'].value &&
                    paymentStatus === Enum['payment_status']['PENDING'].value
                  "
            :loading="checkBtnLoading"
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
