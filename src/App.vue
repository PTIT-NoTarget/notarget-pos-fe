<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
//
</script>

<style>

* {
  scrollbar-width: thin; /* Đối với Firefox */
  scrollbar-color: #b0b0b0 #e0e0e0; /* Màu xám nhạt hơn */
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #e0e0e0; /* Nền xám nhạt */
}

::-webkit-scrollbar-thumb {
  background-color: #b0b0b0; /* Màu của thanh cuộn xám nhạt */
  border-radius: 6px;
  border: 3px solid #e0e0e0;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #a0a0a0; /* Màu khi hover tối hơn một chút */
}

::-webkit-scrollbar-corner {
  background: #e0e0e0;
}

</style>
