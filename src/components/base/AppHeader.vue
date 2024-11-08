<script setup lang="ts">
import router from "@/router";
import {AuthService} from "@/services/AuthService";

const user: any = {
  initials: 'JD',
  fullName: 'John Doe',
  email: 'john.doe@doe.com',
}

const leftMenu = [
  {
    title: 'Trang chủ',
    icon: 'mdi-home',
    route: '/',
  },
  {
    title: 'Hàng hóa',
    icon: 'mdi-store',
    route: '/product',
    children: [
      {
        title: 'Danh sách hàng hóa',
        icon: 'mdi-format-list-bulleted',
        route: '/product/list',
      },
      {
        title: 'Nhập hàng',
        icon: 'mdi-cart-plus',
        route: '/product/import',
      },
      {
        title: 'Xuất hàng',
        icon: 'mdi-cart-arrow-down',
        route: '/product/export',
      },
    ],
  },
  {
    title: 'Khách hàng',
    icon: 'mdi-account-group',
    route: '/customer',
  },
  {
    title: 'Nhân viên',
    icon: 'mdi-account',
    route: '/employee',
  }
]

const rightMenu = [
  {
    title: 'Bán hàng',
    icon: 'mdi-cash-register',
    route: '/sell',
    action: () => {
      removeOtp()
    },
  },
  {
    title: 'Thông báo',
    icon: 'mdi-bell',
    route: '/notification',
  },
  {
    title: 'Cài đặt',
    icon: 'mdi-cog',
    route: '/setting',
    children: [
      {
        title: 'Cài đặt chung',
        icon: 'mdi-cog',
        route: '/setting/general',
      },
      {
        title: 'Cài đặt máy in',
        icon: 'mdi-printer',
        route: '/setting/print',
      },
    ],
  },
]

const logout = () => {
  localStorage.removeItem('access_token')
  router.push('/sign-in')
}

const removeOtp = () => {
  console.log('remove otp')
  let request = {
    access_token: localStorage.getItem('access_token'),
  }
  AuthService.removeOtp(request)
    .then((res) => {
      localStorage.setItem('access_token', res.data.data.access_token)
      router.push('/sell')
    })
}

</script>

<template>
  <v-app-bar
    color="primary"
    density="compact"
  >
    <template v-slot:prepend>
      <v-btn :to="'/'" rounded density="default" :active="false">
        <v-icon icon="mdi-store" size="32px"></v-icon>
      </v-btn>
    </template>
    <CustomListMenu :items="leftMenu"/>
    <v-spacer></v-spacer>
    <CustomListMenu :items="rightMenu" style="margin-right: 24px"/>
    <template v-slot:append>
      <v-menu
        rounded
        open-on-hover
      >
        <template v-slot:activator="{ props }">
          <v-btn
            icon
            v-bind="props"
            style="margin-right: 12px"
          >
            <v-avatar color="brown">
              <span class="text-h6">{{ user.initials }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar
                color="brown"
              >
                <span class="text-h5">{{ user.initials }}</span>
              </v-avatar>
              <h3>{{ user.fullName }}</h3>
              <v-divider class="my-3"></v-divider>
              <v-btn
                variant="text"
                rounded
                @click="logout"
              >
                Log out
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </template>
  </v-app-bar>
</template>

<style scoped lang="sass">

</style>
