<script setup lang="ts">
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
            'margin': '0.5% auto',
            'width': '100%'
          }"
        >
          <v-card-item>
            <div class="text-h4 mb-1">
              Doanh thu hôm nay
            </div>
            <v-divider class="mb-4"></v-divider>
            <v-row style="font-size: 24px; height: 100%; display: flex; ">
              <v-col cols="6">
                <v-icon>mdi-package-variant-closed</v-icon>
                Đơn hàng: <strong>10</strong>
              </v-col>
              <v-col cols="6">
                <v-icon>mdi-cash</v-icon>
                Doanh thu: <strong>10.000.000</strong>
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
          <v-card-item>
            <div>
              <div class="text-h4 mb-1">
                Doanh thu hôm nay
              </div>
              <div class="text-caption">Greyhound divisely hello coldly fonwderfully</div>
            </div>
          </v-card-item>
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
              <div class="text-h6 mb-1">
                Hoạt động gần đây
              </div>
              <div class="text-caption">Greyhound divisely hello coldly fonwderfully</div>
            </div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="sass">

</style>
