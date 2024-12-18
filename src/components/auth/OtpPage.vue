<script setup lang="ts">
import router from "@/router";
import { AuthService } from "@/services/AuthService";
import { useToastStore } from "@/stores/toast";

const otpVisible = ref<boolean>(true);
const otpCode = ref<string>("");
const attemptsLeft = ref<number>(3); // Số lần còn lại

const onLoginToAdminWithOTP = () => {
  if (attemptsLeft.value <= 1) {
    useToastStore().showError("Bạn đã vượt quá số lần thử cho phép");
    router.push("/sell");
    return;
  }

  let accessToken = localStorage.getItem("access_token");
  let request = {
    access_token: accessToken,
    otp_code: otpCode.value,
  };

  AuthService.signInWithOtp(request)
    .then((res) => {
      useToastStore().showSuccess("Đăng nhập thành công");
      localStorage.setItem("access_token", res.data.data.access_token);
      router.push("/");
    })
    .catch(() => {
      attemptsLeft.value -= 1;
    })
    .finally(() => {
      otpCode.value = "";
    });
};

const handleCancel = () => {
  router.push("/sell");
};
</script>

<template>
  <v-dialog v-model="otpVisible" persistent max-width="500">
    <v-card>
      <v-card-title class="text-center">
        <h2>Nhập mã OTP</h2>
      </v-card-title>
      <v-card-text>
        <v-otp-input
          :autofocus="true"
          length="6"
          type="number"
          v-model="otpCode"
          @finish="onLoginToAdminWithOTP"
        ></v-otp-input>
        <p v-if="attemptsLeft !== 3" class="text-center text-red text">
          Số lần thử còn lại: {{ attemptsLeft }}
        </p>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="onLoginToAdminWithOTP">Xác nhận</v-btn>
        <v-btn color="secondary" @click="handleCancel">Hủy</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="sass"></style>
