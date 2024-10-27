<script lang="ts" setup>
import { viewService } from '@/services/ViewService'

const headers = ref<any[]>([])
const items = ref<any[]>([])
const info = ref<any>({})
const selected = ref<any[]>([])
const rowActions = ref<any[]>([
  {
    icon: 'delete',
    label: '',
    action: (item: any) => remove(item),
  },
])
const viewName = 'product_list_sell'

onMounted(() => {
  viewService.getViewByViewName(viewName)
    .then((res: any) => {
      headers.value = res.data.data
    })
})

const remove = (item: any) => {
  const index = items.value.findIndex((i: any) => i.id === item.id)
  if (index !== -1) {
    items.value.splice(index, 1)
  }
}

const addNewRow = (item: any) => {
  const existingItem: any = items.value.find((i: any) => i.id === item.id)
  if (existingItem) {
    existingItem.quantity += 1
    existingItem.price = existingItem.price * existingItem.quantity - existingItem.discount
  } else {
    items.value.push({
      ...item,
      quantity: 1,
      discount: 0,
      price: item.final_price
    })
  }
}

watch(
  items,
  (newVal: any[]) => {
    newVal.forEach((item: any) => {
      item.price = item.final_price * item.quantity - item.discount
    })
  },
  {
    deep: true,
  }
)

</script>

<template>
  <v-row>
    <v-col cols="3">
      <SellSearchInput @add="addNewRow"/>
    </v-col>
    <v-col cols="8">
      <v-tabs
        bg-color="white"
        center-active
        hide-slider
      >
        <v-tab>One</v-tab>
        <v-tab>Two</v-tab>
        <v-tab>Three</v-tab>
        <v-tab>Four</v-tab>
        <v-tab>Five</v-tab>
        <v-tab>Six</v-tab>
        <v-tab>Seven</v-tab>
        <v-tab>Eight</v-tab>
        <v-tab>Nine</v-tab>
        <v-tab>Ten</v-tab>
        <v-tab>Eleven</v-tab>
        <v-tab>Twelve</v-tab>
        <v-tab>Thirteen</v-tab>
        <v-tab>Fourteen</v-tab>
        <v-tab>Fifteen</v-tab>
        <v-tab>Sixteen</v-tab>
        <v-tab>Seventeen</v-tab>
        <v-tab>Eighteen</v-tab>
        <v-tab>Nineteen</v-tab>
        <v-tab>Twenty</v-tab>
      </v-tabs>
    </v-col>
    <v-col cols="1" class="flex justify-center align-center">
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-col>
  </v-row>
  <v-divider thickness="4"></v-divider>
  <v-row>
    <v-col cols="8">
      <Table
        :columns="headers"
        :items="items"
        :row-actions="rowActions"
        :show-selected="true"
        :selected="selected"
        :highlight-row="false"
        :have-pagination="false"
      />
    </v-col>
    <v-col cols="4">
      <SellInfo
        :info="info"
      />
    </v-col>
  </v-row>

</template>

<style scoped lang="sass">

</style>
