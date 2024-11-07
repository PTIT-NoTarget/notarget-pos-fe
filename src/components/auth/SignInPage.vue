<script setup lang="ts">
import { AuthService } from '@/services/AuthService'
import { useToastStore } from '@/stores/toast'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref<string>('')
const password = ref<string>('')
const showPassword = ref<boolean>(false)
const otpVisible = ref<boolean>(false)
const otpCode = ref<string>('')

let usernameRules = [
  (v: string) => !!v || 'Username is required',
]

let passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => (v && v.length >= 8) || 'Password must be at least 8 characters',
]

const onLoginToSell = () => {
  let request = {
    username: username.value,
    password: password.value
  }
  AuthService.signIn(request)
    .then((res) => {
      useToastStore().showSuccess('Đăng nhập thành công')
      localStorage.setItem('access_token', res.data.data.access_token)
      router.push('/sell')
    })
}

const onLoginToAdmin = () => {
  let request = {
    username: username.value,
    password: password.value
  }
  AuthService.signIn(request)
    .then((response) => {
      otpVisible.value = true
    })
}

const onLoginToAdminWithOTP = (accessToken: string) => {
  let request = {
    access_token: accessToken,
    otpCode: otpCode.value
  }
  AuthService.signInWithOtp(request)
    .then((response) => {
      console.log(response)
    })
}

</script>

<template>
  <div
    :style="{
      width:'100%',
      height: '100vh',
      paddingRight: '25px',
      display: 'flex',
      justifyContent: 'end',
      alignItems: 'center',
      backgroundImage: 'url(http://res.cloudinary.com/blogweb/image/upload/v1730973208/pos/oiryqbpc5safyepd2cdu.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'right'
    }"
  >
    <v-card :style="{ width: '30%', zIndex: 100, backgroundColor: 'rgba(255, 255, 255, 0.8)' }">
      <v-card-title class="text-center">
        <h2>Đăng nhập hệ thống</h2>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent autocomplete="off">
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
              >{{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}
              </v-icon>
            </template>
          </v-text-field>

          <v-btn
            class="mt-2"
            color="secondary"
            block
            @click="onLoginToSell"
          >Đăng nhập vào trang bán hàng
          </v-btn>
          <v-btn
            class="mt-2"
            color="primary"
            block
            @click="onLoginToAdmin"
          >Đăng nhập vào trang quản lý
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
      zIndex: 1,
    }"
  ></div>
  <v-dialog
    v-model="otpVisible"
    persistent
    max-width="500"
  >
    <v-card>
      <v-card-title class="text-center">
        <h2>Nhập mã OTP</h2>
      </v-card-title>
      <v-card-text>
        <v-otp-input
          length="6"
          type="number"
          v-model="otpCode"
        ></v-otp-input>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          @click="onLoginToAdminWithOTP"
        >Xác nhận
        </v-btn>
        <v-btn color="secondary" @click="otpVisible = false">Hủy</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="sass">

</style>
