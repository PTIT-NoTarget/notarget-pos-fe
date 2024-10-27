<script setup lang="ts">
defineProps<{
  items: any[]
}>()
</script>

<template>
  <v-list class="horizontal-menu" bg-color="primary">
    <template v-for="item in items" :key="item.title">
      <v-menu v-if="item.children" open-on-hover rounded>
        <template #activator="{ props }">
          <v-list-item v-bind="props" :to="item.route">
            <div style="display: flex; gap: 8px">
              <v-icon>{{ item.icon }}</v-icon>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </div>
          </v-list-item>
        </template>
        <v-list>
          <v-list-item
            v-for="child in item.children"
            :key="child.title"
            :to="child.route"
          >
            <div style="display: flex; gap: 8px">
              <v-icon>{{ child.icon }}</v-icon>
              <v-list-item-title>{{ child.title }}</v-list-item-title>
            </div>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-list-item v-else :to="item.route">
        <div style="display: flex; gap: 8px">
          <v-icon>{{ item.icon }}</v-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </div>
      </v-list-item>
    </template>
  </v-list>
</template>

<style scoped lang="sass">
.horizontal-menu
  display: flex
  flex-direction: row
  gap: 16px
</style>
