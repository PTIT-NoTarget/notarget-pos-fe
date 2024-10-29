<script lang="ts" setup>
import { viewService } from '@/services/ViewService'

const headers = ref<any[]>([])
const itemsMap = ref<Map<number, any[]>>(new Map())
const infoMap = ref<Map<number, any>>(new Map())
const rowActions = ref<any[]>([
  {
    icon: 'delete',
    label: '',
    action: (item: any) => remove(item),
  },
])
const activeTab = ref<number>(-1)
const tabs = ref<any[]>([])
const viewName = 'product_list_sell'

onMounted(() => {
  tabs.value = JSON.parse(localStorage.getItem('tabs') || '[]')
  itemsMap.value = new Map(JSON.parse(localStorage.getItem('itemsMap') || '[]'))
  infoMap.value = new Map(JSON.parse(localStorage.getItem('infoMap') || '[]'))
  activeTab.value = JSON.parse(localStorage.getItem('activeTab') || '-1')
  if (tabs.value.length === 0) {
    addNewTab()
  }
  viewService.getViewByViewName(viewName)
    .then((res: any) => {
      headers.value = res.data.data
    })
})

watch(
  activeTab,
  (newVal: number) => {
    if (newVal !== -1) {
      localStorage.setItem('activeTab', JSON.stringify(newVal))
    }
  }
)

watch(
  tabs,
  (newVal: any[]) => {
    localStorage.setItem('tabs', JSON.stringify(newVal))
  },
  {
    deep: true,
  }
)

watch(
  itemsMap,
  (newVal: Map<number, any[]>) => {
    let total: number = 0
    let discount: number = 0
    newVal.get(activeTab.value)?.forEach((item: any) => {
      item.quantity = item.quantity < 0 ? 0 : item.quantity
      item.price = item.final_price * item.quantity - item.discount
      total += item.price
      discount += item.discount
    })
    infoMap.value.get(activeTab.value).total = total
    infoMap.value.get(activeTab.value).discount = discount
    localStorage.setItem('itemsMap', JSON.stringify(Array.from(newVal.entries())))
  },
  {
    deep: true,
  }
)

watch(
  infoMap,
  (newVal: Map<number, any>) => {
    newVal.get(activeTab.value).final = newVal.get(activeTab.value).total - newVal.get(activeTab.value).discount
    localStorage.setItem('infoMap', JSON.stringify(Array.from(newVal.entries())))
  },
  {
    deep: true,
  }
)

const remove = (item: any) => {
  let items = itemsMap.value.get(activeTab.value) || []
  const index = items.findIndex((i: any) => i.id === item.id)
  if (index !== -1) {
    items.splice(index, 1)
  }
}

const addNewRow = (item: any) => {
  let items = itemsMap.value.get(activeTab.value) || []
  const existingItem: any = items.find((i: any) => i.id === item.id)
  if (existingItem) {
    existingItem.quantity += 1
    existingItem.price = existingItem.price * existingItem.quantity - existingItem.discount
  } else {
    items.push({
      ...item,
      quantity: 1,
      discount: 0,
      price: item.final_price
    })
  }
}

const addNewTab = () => {
  let maxId = 0
  tabs.value.forEach((tab) => {
    if (tab.id > maxId) {
      maxId = tab.id
    }
  })

  tabs.value.push({
    id: maxId + 1,
    name: 'Hoá đơn ' + (maxId + 1),
  })
  activeTab.value = maxId + 1
  itemsMap.value.set(maxId + 1, [])
  infoMap.value.set(maxId + 1, {
    total: 0,
    discount: 0,
    final: 0,
  })
}

const removeTab = (id: number) => {
  const index = tabs.value.findIndex((tab) => tab.id === id)
  if (index !== -1) {
    tabs.value.splice(index, 1)
    itemsMap.value.delete(id)
    infoMap.value.delete(id)
    if (activeTab.value === id) {
      activeTab.value = tabs.value.length > 0 ? tabs.value[0].id : -1
    }
    if (tabs.value.length === 0) {
      addNewTab()
    }
  }
}

</script>

<template>
  <v-row>
    <v-col cols="3">
      <SellSearchInput @add="addNewRow"/>
    </v-col>
    <v-col cols="9" style="display:flex; justify-content: space-between;align-items: center">
      <v-tabs
        bg-color="white"
        center-active
        hide-slider
      >
        <v-tab
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :active="activeTab === tab.id"
        >
          <template v-slot:append>
            <v-icon @click.stop="removeTab(tab.id)" size="25px">mdi-close</v-icon>
          </template>
          {{ tab.name }}
        </v-tab>
        <v-tab @click="addNewTab">
          <v-icon>mdi-plus</v-icon>
        </v-tab>
      </v-tabs>
      <v-menu
        rounded
        open-on-hover
      >
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" style="margin-right: 12px">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-btn variant="text" rounded :to="'/'">
                Trang chủ
              </v-btn>
              <v-divider class="my-3"></v-divider>
              <v-btn variant="text" rounded>
                Đăng xuất
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-col>
  </v-row>
  <v-divider thickness="4"></v-divider>
  <v-row style="height: calc(100% - 72px)">
    <template v-if="activeTab !== -1">
      <v-col cols="8" style="height: 100%">
        <Table
          :columns="headers"
          :items="itemsMap.get(activeTab)"
          :row-actions="rowActions"
          :highlight-row="false"
          :have-pagination="false"
        />
      </v-col>
      <v-col cols="4" style="height: 100%">
        <SellInfo
          :info="infoMap.get(activeTab)"
        />
      </v-col>
    </template>
  </v-row>

</template>

<style scoped lang="sass">

</style>
