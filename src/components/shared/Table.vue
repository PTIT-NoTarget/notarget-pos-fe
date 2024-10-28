<script lang="ts" setup>
import { DataType } from '@/utils/Constant'

const props = withDefaults(defineProps<{
  height?: number;
  columns: any[];
  items: any[];
  selectMap?: Map<string, any[]>;
  rowActions?: any[];
  filter?: any;
  selected?: any[];
  showSelected?: boolean;
  totalData?: number;
  loading?: boolean;
  highlightRow?: boolean;
  tableActions?: any[];
  havePagination?: boolean;
}>(), {
  height: 600,
  showSelected: false,
  highlightRow: false,
  loading: false,
  havePagination: true,
  filter: () => ({
    pageNumber: 1,
    pageSize: 1000000,
  }),
  selected: () => [],
})

const emit = defineEmits()

const tableHeight = computed(() => {
  const itemCount = Math.min((props.items ? props.items.length : 0), props.filter['pageSize']) + 1
  const calculatedHeight = itemCount * rowHeight
  return Math.min(calculatedHeight, props.height) + 'px'
})

const isSelectAll = ref(false)
const selectedItems = ref(new Set())
const activeItem = ref<any>({ id: -1 })

const handleSelectAll = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  isSelectAll.value = checked
  if (checked) {
    props.items.forEach((item: any) => selectedItems.value.add(item.id))
  } else {
    selectedItems.value.clear()
  }
  props.selected.splice(0, props.selected.length, ...Array.from(selectedItems.value))
}

const handleSelectRow = (event: Event, item: any) => {
  const checked = (event.target as HTMLInputElement).checked
  if (checked) {
    selectedItems.value.add(item.id)
  } else {
    selectedItems.value.delete(item.id)
  }
  isSelectAll.value = props.items.every(item => selectedItems.value.has(item.id))
  props.selected.splice(0, props.selected.length, ...Array.from(selectedItems.value))
}

const widthStyle: any = (width: string) => {
  return {
    width: width,
    minWidth: width,
    maxWidth: width,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
}

const handleRowClick = (item: any) => {
  if (activeItem.value.id === item.id) {
    emit('handleRowClick', item)
    return
  }
  activeItem.value = item
}

const rowHeight = 42
const headerColor = '#65aad3'
const activeColor = '#d1dfe3'

</script>

<template>
  <v-data-table-server
    :headers="columns"
    :items="items"
    :items-length="totalData ?? (items ? items.length : 0)"
    fixed-header
    :height="tableHeight"
    v-model:page="filter['pageNumber']"
    v-model:items-per-page="filter['pageSize']"
    :loading="loading"
    :hide-default-footer="!havePagination"
  >
    <template v-slot:headers="{ columns }">
      <tr :style="{ backgroundColor: headerColor }">
        <td v-if="showSelected" :style="widthStyle('50px')">
          <v-checkbox
            v-model="isSelectAll"
            :indeterminate="selectedItems.size > 0 && !isSelectAll"
            hide-details
            density="compact"
            @change="handleSelectAll"
          ></v-checkbox>
        </td>
        <template v-for="column in columns" :key="column['key_name']">
          <td :style="widthStyle(column['width'])">
            <span class="text-h6">{{ column['key_title'] }}</span>
          </td>
        </template>
      </tr>
    </template>
    <template v-slot:item="{ item }">
      <tr :style="(activeItem.id === item.id && highlightRow) ? {backgroundColor: activeColor} : {}"
          @click="handleRowClick(item)"
      >
        <td v-if="showSelected" :style="widthStyle('50px')">
          <v-checkbox
            :model-value="selectedItems.has(item.id)"
            hide-details
            density="compact"
            @change="(e : any) => handleSelectRow(e, item)"
          ></v-checkbox>
        </td>
        <template v-for="column in columns" :key="column['key_name']">
          <template v-if="column['key_name'] !== 'actions'">
            <td :style="widthStyle(column['width'])">
              <template v-if="column['data_type'] === DataType.RELATION">
                <template v-if="column['is_edit']">
                  <v-tooltip location="top">
                    <template v-slot:activator="{ props }">
                      <v-select
                        v-bind="props"
                        :items="selectMap?.get(column['key_name'])"
                        v-model="item[column['key_name']]"
                        density="compact"
                        hide-details="auto"
                        item-title="name"
                        return-object
                      ></v-select>
                    </template>
                    <span>{{ item[column['key_name']].name }}</span>
                  </v-tooltip>

                </template>
                <template v-else>
                  <v-tooltip location="top">
                    <template v-slot:activator="{ props }">
                      <span v-bind="props">
                        {{ item[column['key_name']].name }}
                      </span>
                    </template>
                    <span>{{ item[column['key_name']].name }}</span>
                  </v-tooltip>
                </template>
              </template>
              <template v-else-if=" column['data_type'] === DataType.INTEGER || column['data_type'] === DataType.LONG">
                <IntegerNumberInput
                  :editable="column['is_edit']"
                  :tooltip="true"
                  v-model="item[column['key_name']]"
                />
              </template>
              <template v-else-if="column['data_type'] === DataType.DOUBLE">
                <FloatNumberInput
                  :editable="column['is_edit']"
                  :tooltip="true"
                  v-model="item[column['key_name']]"
                />
              </template>
              <template v-else-if="column['data_type'] === DataType.IMAGE">
                <template v-if="column['is_edit']">

                </template>
                <template v-else>
                  <v-avatar
                    :src="item[column['key_name']]"
                  ></v-avatar>
                </template>
              </template>
              <template v-else>
                <template v-if="column['is_edit']">
                  <v-tooltip location="top">
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-model="item[column['key_name']]"
                        hide-details="auto"
                        type="text"
                        v-bind="props"
                        density="compact"
                      ></v-text-field>
                    </template>
                    <span>{{ item[column['key_name']] }}</span>
                  </v-tooltip>
                </template>
                <template v-else>
                  <v-tooltip location="top">
                    <template v-slot:activator="{ props }">
                      <span v-bind="props">
                        {{ item[column['key_name']] }}
                      </span>
                    </template>
                    <span>{{ item[column['key_name']] }}</span>
                  </v-tooltip>
                </template>
              </template>
            </td>

          </template>
          <template v-else>
            <td
              :style="{ ...widthStyle(column['width']), display: 'flex', justifyContent:'center',  alignItems:'center'}"
            >
              <template v-for="action in rowActions" :key="action.label">
                <v-btn density="comfortable" @click="action.action(item)">
                  <v-icon :icon="'mdi-' + action.icon"></v-icon>
                  {{ action.label }}
                </v-btn>
              </template>
            </td>
          </template>
        </template>
      </tr>
    </template>
  </v-data-table-server>
</template>

<style lang="sass">
.v-table tr
  height: 42px !important

.v-table td
  height: 42px !important
  padding: 0 8px !important

.v-input__prepend
  margin-inline-end: 0 !important


.v-input__append
  margin-inline-start: 0 !important


.v-btn--size-default
  min-width: 0 !important
</style>
