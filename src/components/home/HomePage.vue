<script setup lang="ts">
import { Enum } from '@/utils/Enum'
import { OrderService } from '@/services/OrderService'

const xAxisData = ref<any[]>([])
const orderData = ref<any[]>([])
const revenueData = ref<any[]>([])
const timeRange = ref<any>(Enum['revenue_report'].WEEK.value)
const chartLoading = ref<boolean>(false)
const general = ref<any>({})
const recentActivity = ref<any[]>([])

onMounted(() => {
  loadRevenueToday()
  loadRecentActivity()
  loadChart()
})

const loadRevenueToday = () => {
  OrderService.general().then((res) => {
    general.value = res.data.data
  })
}

const loadRecentActivity = () => {
  OrderService.recent().then((res) => {
    recentActivity.value = res.data.data
  })
}

const loadChart = () => {
  chartLoading.value = true
  OrderService.revenueReport(timeRange.value).then((res) => {
    xAxisData.value = res.data.data['x_axis_data']
    orderData.value = res.data.data['order_data']
    revenueData.value = res.data.data['revenue_data']
    chartLoading.value = false
  })
}

watch(timeRange, () => {
  console.log('timeRange', timeRange.value)
  loadChart()
})

const colors = ['#5470C6', '#91CC75']
const option = ref({
  color: colors,
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
    },
  },
  toolbox: {
    feature: {
      dataView: {
        show: true,
        readOnly: false,
      },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
  legend: {
    data: ['Đơn hàng', 'Doanh thu'],
  },
  xAxis: [
    {
      type: 'category',
      axisTick: {
        alignWithLabel: true,
      },
      data: xAxisData.value,
    },
  ],
  yAxis: [
    {
      type: 'value',
      name: 'Đơn hàng',
      position: 'left',
      alignTicks: true,
      axisLine: {
        show: true,
        lineStyle: {
          color: colors[0],
        },
      },
      axisLabel: {
        formatter: '{value} đơn',
      },
    },
    {
      type: 'value',
      name: 'Doanh thu',
      position: 'right',
      alignTicks: true,
      axisLine: {
        show: true,
        lineStyle: {
          color: colors[1],
        },
      },
      axisLabel: {
        formatter: '{value} vnd',
      },
    },
  ],
  series: [
    {
      name: 'Đơn hàng',
      type: 'bar',
      yAxisIndex: 0,
      data: orderData.value,
    },
    {
      name: 'Doanh thu',
      type: 'line',
      yAxisIndex: 1,
      data: revenueData.value,
    },
  ],
})
watch([xAxisData, orderData, revenueData], () => {
  option.value = {
    ...option.value,
    xAxis: [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true,
        },
        data: xAxisData.value,
      },
    ],
    series: [
      {
        name: 'Đơn hàng',
        type: 'line',
        yAxisIndex: 0,
        data: orderData.value,
      },
      {
        name: 'Doanh thu',
        type: 'bar',
        yAxisIndex: 1,
        data: revenueData.value,
      },
    ],
  }
})
</script>

<template>
  <v-container fluid class="pa-1">
    <v-row gutters="1" :dense="true">
      <v-col cols="10" style="height: calc(100vh - 48px)">
        <v-card
          color="primary"
          variant="tonal"
          class="mx-auto"
          rounded
          height="14%"
          :style="{
            margin: '0.5% auto',
            width: '100%'
          }"
        >
          <v-card-item>
            <div class="text-h4 mb-1">Doanh thu hôm nay</div>
            <v-divider class="mb-4"></v-divider>
            <v-row style="font-size: 24px; height: 100%; display: flex">
              <v-col cols="6">
                <v-icon>mdi-package-variant-closed</v-icon>
                Đơn hàng: <strong>{{ general?.total_order }}</strong>
              </v-col>
              <v-col cols="6">
                <v-icon>mdi-cash</v-icon>
                Doanh thu:
                <strong>{{
                    general?.total_revenue?.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })
                  }}</strong>
              </v-col>
            </v-row>
          </v-card-item>
        </v-card>
        <v-card
          color="primary"
          variant="tonal"
          class="mx-auto"
          rounded
          height="84%"
        >
          <v-card-text style="height: 100%">
            <div class="d-flex justify-space-between">
              <div class="text-h4 mb-1">Thống kê đơn hàng và doanh thu</div>
              <div style="width: 300px">
                <EnumInput
                  v-model="timeRange"
                  :editable="true"
                  :tooltip="false"
                  :variant="'solo-filled'"
                  :key-name="'revenue_report'"
                  :can-search="false"
                />
              </div>
            </div>
            <v-echart
              class="chart"
              :option="option"
              autoresize
              :loading="chartLoading"
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="2" style="height: calc(100vh - 48px)">
        <v-card
          color="primary"
          variant="tonal"
          class="mx-auto"
          rounded
          height="99%"
          :style="{
            'margin-top': '2%',
          }"
        >
          <v-card-item>
            <div>
              <div class="text-h6 mb-1">Hoạt động gần đây</div>
              <v-divider class="mb-4"></v-divider>
              <template v-for="(activity, index) in recentActivity">
                <v-divider v-if="index !== 0" class="mb-2"></v-divider>
                <v-icon>mdi-package-variant-closed</v-icon>
                Nhân viên
                <strong>{{
                    activity.employee ? activity.employee.full_name : 'Admin'
                  }}</strong>
                đã bán hàng tổng đơn hết
                <strong>{{
                    activity.final_total.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })
                  }}</strong>
              </template>
            </div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="sass">
.chart
  height: 100%
</style>
