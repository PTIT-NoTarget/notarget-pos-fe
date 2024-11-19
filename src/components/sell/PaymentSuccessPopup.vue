<script setup lang="ts">
import { Enum } from "@/utils/Enum";

const props = withDefaults(
  defineProps<{
    visible?: any;
    info?: any;
  }>(),
  {
    content: "",
    visible: {
      visible: false,
    },
  },
);

const title = ref<string>("Thanh toán thành công");
const emit = defineEmits();

const popupTitle = computed(() => {
  if (props.visible["payment"] === Enum["payment"]["CASH"].value) {
    return "Thanh toán thành công";
  } else if (props.visible["payment"] === Enum["payment"]["TRANSFER"].value) {
    if (
      props.visible.payment_status === Enum["payment_status"]["PAID"].value
    ) {
      return "Thanh toán thành công";
    } else {
      return "Thanh toán chờ xác nhận";
    }
  }
});

const modelVisible = computed({
  get: () => props.visible,
  set: (newValue) => {
    emit("update:visible", newValue);
  },
});

const handleCancel = () => {
  modelVisible.value.visible = false;
  if (
    modelVisible.value.payment_status === Enum["payment_status"]["PAID"].value
  ) {
    emit("submit", props.info.tabId);
  }
};

const qrCodeUrl = computed(() => {
  return `https://img.vietqr.io/image/mbbank-VQRQAAVMM8786-qr_only.jpg?amount=${props.info["final_total"]}&addInfo=${props.info["payment_uid"]}&accountName=QUAN%20CO%20VAN%20SUU`;
});
</script>

<template>
  <v-dialog v-model="modelVisible.visible" width="auto" :persistent="true">
    <v-card width="500" :title="popupTitle">
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
              v-if="
                modelVisible.payment_status ===
                Enum['payment_status']['PAID'].value
              "
            >
              <v-icon color="success" size="100">mdi-check-circle</v-icon>
              <div class="text-h5 mt-3">
                {{ info.name }} đã thanh toán thành công
              </div>
            </template>
            <template
              v-else-if="
                modelVisible.payment_status ===
                Enum['payment_status']['PENDING'].value
              "
            >
              <v-img
                :src="qrCodeUrl"
                width="200"
                height="200"
                class="mx-auto mt-3"
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
            border="success"
            @click="handleCancel"
            variant="outlined"
            width="100"
          >
            OK
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="sass"></style>
