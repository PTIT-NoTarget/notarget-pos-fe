<script lang="ts" setup>
import { viewService } from '@/services/ViewService'

const headers = ref<any[]>([])
const selectMap = new Map<string, any[]>()
const items = ref<any[]>([])
const selected = ref<any[]>([])
const loading = ref<boolean>(false)
const rowActions = ref<any[]>([
  {
    icon: 'delete',
    label: 'Delete',
    action: (item: any) => remove(item),
  },
])
const viewName = "product_list_sell";

onMounted(() => {
  viewService.getViewByViewName(viewName)
    .then((res: any) => {
      headers.value = res.data.data
    });
})

const addNewRow = (item: any) => {
  // if same id already exists, increase quantity
  const existingItem : any = items.value.find((i: any) => i.id === item.id)
  if (existingItem) {
    existingItem.quantity += 1
  } else {
    items.value.push({
      ...item,
      quantity: 1
    })
  }
}

const remove = (item: any) => {
  const index = items.value.findIndex((i: any) => i.id === item.id)
  if (index !== -1) {
    items.value.splice(index, 1)
  }
}

watch(
  selected,
  (newVal: any) => {
    console.log('Selected: ', newVal)
  },
  {
    deep: true,
    immediate: true
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
    <v-col cols="1">
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-col>
  </v-row>
  <v-divider></v-divider>
  <v-row>
    <v-col cols="8">
      <Table
        :loading="loading"
        :columns="headers"
        :items="items"
        :select-map="selectMap"
        :row-actions="rowActions"
        :show-selected="true"
        :selected="selected"
        :highlight-row="false"
        :have-pagination="false"
      ></Table>
    </v-col>
    <v-col cols="4">

    </v-col>
  </v-row>

</template>

<style scoped lang="sass">

</style>
