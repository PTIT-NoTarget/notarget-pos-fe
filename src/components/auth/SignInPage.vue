<script setup lang="ts">
import { AuthService } from "@/services/AuthService";
import { useToastStore } from "@/stores/toast";
import { useRouter } from "vue-router";

const router = useRouter();

const username = ref<string>("");
const password = ref<string>("");
const showPassword = ref<boolean>(false);

let usernameRules = [(v: string) => !!v || "Username is required"];

let passwordRules = [(v: string) => !!v || "Password is required"];

const onLoginToSell = () => {
  let request = {
    username: username.value,
    password: password.value,
  };
  AuthService.signIn(request).then((res) => {
    useToastStore().showSuccess("Đăng nhập thành công");
    localStorage.setItem("access_token", res.data.data.access_token);
    router.push("/sell");
  });
};

const onLoginToAdmin = () => {
  let request = {
    username: username.value,
    password: password.value,
  };
  AuthService.signIn(request).then((res) => {
    localStorage.setItem("access_token", res.data.data.access_token);
    router.push("/otp");
  });
};

const handleKeyPress = (e: any) => {
  if (e.key === "Enter" && e.altKey) {
    onLoginToAdmin();
  } else if (e.key === "Enter") {
    onLoginToSell();
  }
};
</script>

<template>
  <div
    :style="{
      width: '100%',
      height: '100vh',
      paddingRight: '25px',
      display: 'flex',
      justifyContent: 'end',
      alignItems: 'center',
      backgroundImage:
        'url(https://res.cloudinary.com/blogweb/image/upload/v1730973208/pos/oiryqbpc5safyepd2cdu.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'right'
    }"
  >
    <v-card
      :style="{
        width: '30%',
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
      }"
    >
      <v-card-title class="text-center">
        <h2>Đăng nhập hệ thống</h2>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent @keydown="handleKeyPress" autocomplete="off">
          <v-text-field
            type="text"
            v-model="username"
            :rules="usernameRules"
            label="Username"
            variant="solo-filled"
          ></v-text-field>

          <v-text-field
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            :rules="passwordRules"
            label="Password"
            variant="solo-filled"
          >
            <template v-slot:append-inner>
              <v-icon
                :color="showPassword ? 'primary' : 'grey'"
                @click="showPassword = !showPassword"
                >{{ showPassword ? "mdi-eye-off" : "mdi-eye" }}
              </v-icon>
            </template>
          </v-text-field>

          <v-btn class="mt-2" color="secondary" block @click="onLoginToSell">
            Đăng nhập vào trang bán hàng
          </v-btn>
          <v-btn class="mt-2" color="primary" block @click="onLoginToAdmin">
            Đăng nhập vào trang quản lý
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
  <div
    :style="{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1
    }"
  ></div>
</template>

<style scoped lang="sass"></style>
