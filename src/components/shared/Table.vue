<script lang="ts" setup>
import { DataType } from "@/utils/Constant";

const props = withDefaults(
  defineProps<{
    height?: number;
    columns: any[];
    items: any[];
    selectMap?: Map<string, any[]>;
    rowActions?: any[];
    filter?: any;
    haveFilter?: boolean;
    selected?: any[];
    showSelected?: boolean;
    totalData?: number;
    loading?: boolean;
    highlightRow?: boolean;
    tableActions?: any[];
    showSearch?: boolean;
    havePagination?: boolean;
    sortable?: boolean;
  }>(),
  {
    height: 600,
    showSelected: false,
    highlightRow: false,
    loading: false,
    havePagination: true,
    showSearch: false,
    haveFilter: false,
    sortable: false,
    filter: () => ({
      pageNumber: 1,
      pageSize: 1000000,
    }),
    selected: () => [],
  },
);

const emit = defineEmits(["handleRowClick", "update:selected", "update:loading"]);

const tableHeight = computed(() => {
  let itemCount =
    Math.min(props.items ? props.items.length : 0, props.filter["pageSize"]) +
    1;
  let calculatedHeight = itemCount * rowHeight + 10;
  let finalHeight = Math.min(calculatedHeight, props.height);
  if (
    props.tableActions &&
    props.tableActions.length > 0 &&
    finalHeight === props.height
  ) {
    finalHeight -= 60;
  }
  if (props.haveFilter) {
    finalHeight += 42;
  }
  return finalHeight + "px";
});

const pxToNumber = (px: string) => {
  return Number(px.replace("px", ""));
};

const tableHeaders = computed(() => {
  let header: any[] = [];
  let fixedLeftPx: number = props.showSelected ? 50 : 0;
  let fixedRightPx: number = 0;
  let firstRightColumn: any = null;
  let lastLeftColumn: any = null;
  for (let i = 0; i < props.columns.length; i++) {
    const column = props.columns[i];
    if (column?.is_fixed === -1) {
      lastLeftColumn = column;
    } else if (column?.is_fixed === 1 && !firstRightColumn) {
      firstRightColumn = column;
    }
  }

  for (let i = 0; i < props.columns.length; i++) {
    const column = props.columns[i];
    let fixedPx: number = 0;
    if (column?.is_fixed === -1) {
      fixedPx = fixedLeftPx;
      fixedLeftPx += pxToNumber(column?.width);
    } else if (column?.is_fixed === 1) {
      fixedPx = fixedRightPx;
      fixedRightPx += pxToNumber(column?.width);
    }
    header.push({
      ...column,
      fixedPx: fixedPx,
      lastLeft: column?.keyName === lastLeftColumn?.keyName,
      firstRight: column?.keyName === firstRightColumn?.keyName,
    });
  }
  return header;
});

const tableItems = computed(() => {
  if (props.haveFilter) {
    return [{ haveFilter: true }, ...props.items];
  }
  return props.items;
});

const modelSelected = computed({
  get: () => props.selected,
  set: (newValue) => {
    emit("update:selected", newValue);
  },
});

const modelLoading = computed({
  get: () => props.loading,
  set: (newValue) => {
    emit("update:loading", newValue);
  },
});

const isSelectAll = ref(false);
const activeItem = ref<any>({ id: -1 });
const columnFilter = ref<any>({});

const handleSelectAll = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked;
  isSelectAll.value = checked;
  if (checked) {
    modelSelected.value = props.items.map((item) => item.id);
  } else {
    modelSelected.value = [];
  }
};

const handleSelectRow = (event: Event, item: any) => {
  const checked = (event.target as HTMLInputElement).checked;
  if (checked) {
    modelSelected.value.push(item.id);
  } else {
    modelSelected.value = modelSelected.value.filter(
      (id: any) => id !== item.id,
    );
  }
  isSelectAll.value = modelSelected.value.length === props.items.length;
};

watch(
  modelSelected,
  (newVal: any) => {
    isSelectAll.value = newVal.length === props.items.length;
  },
  {
    deep: true,
  },
);

const columnStyle = (column: any, isHeader: boolean = false, item?: any) => {
  let basic: any = {
    width: column["width"],
    minWidth: column["width"],
    maxWidth: column["width"],
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    backgroundColor: isHeader
      ? headerColor
      : props.highlightRow &&
      !item.haveFilter &&
      activeItem.value.id === item?.id
        ? activeColor
        : "white",
    position: "relative",
  };
  if (column?.is_fixed === 1) {
    return {
      ...basic,
      right: column["fixedPx"] + "px",
      position: "sticky",
      backgroundColor: isHeader
        ? headerColor
        : props.highlightRow &&
        !item.haveFilter &&
        activeItem.value.id === item?.id
          ? activeColor
          : "white",
      zIndex: isHeader ? 100 : 1,
      boxShadow: column["lastLeft"]
        ? "-2px 0 5px -2px rgba(0, 0, 0, 0.5)"
        : "none",
    };
  } else if (column?.is_fixed === -1) {
    return {
      ...basic,
      left: column["fixedPx"] + "px",
      position: "sticky",
      backgroundColor: isHeader
        ? headerColor
        : props.highlightRow &&
        !item.haveFilter &&
        activeItem.value.id === item?.id
          ? activeColor
          : "white",
      zIndex: isHeader ? 100 : 1,
      boxShadow: column["firstRight"]
        ? "2px 0 5px -2px rgba(0, 0, 0, 0.5)"
        : "none",
    };
  }
  return basic;
};

const handleRowClick = (item: any) => {
  if (activeItem.value.id === item.id) {
    emit("handleRowClick", item);
    return;
  }
  activeItem.value = item;
};

watch(
  columnFilter,
  (newVal: any) => {
    for (let key in newVal) {
      if (newVal[key] === "") {
        delete props.filter["filter"][key];
      } else {
        props.filter["filter"][key] = {
          value: newVal[key],
          operator: "like",
        };
      }
    }
  },
  {
    deep: true,
  },
);

const rowHeight = 42;
const headerColor = "#65aad3";
const activeColor = "#d1dfe3";
</script>

<template>
  <template v-if="props.tableActions && props.tableActions.length > 0">
    <div
      style="
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      "
    >
      <div>
        <v-text-field
          v-if="showSearch"
          v-model="filter['common']"
          density="compact"
          hide-details="auto"
          type="text"
          append-inner-icon="mdi-magnify"
          width="300px"
        ></v-text-field>
      </div>
      <div>
        <template v-for="action in props.tableActions" :key="action.label">
          <v-btn @click="action.action" color="primary" class="mx-1">
            <v-icon :icon="'mdi-' + action.icon" class="mx-1"></v-icon>
            {{ action.label }}
          </v-btn>
        </template>
      </div>
    </div>
  </template>
  <v-data-table-server
    :headers="tableHeaders"
    :items="tableItems"
    :items-length="totalData ?? (items ? items.length : 0)"
    fixed-header
    :height="tableHeight"
    v-model:page="filter['pageNumber']"
    v-model:items-per-page="filter['pageSize']"
    :hide-default-footer="!havePagination"
  >
    <template v-slot:headers>
      <tr v-bind="props">
        <td
          v-if="showSelected"
          :style="
            columnStyle({ width: '50px', is_fixed: -1, fixedPx: 0 }, true)
          "
        >
          <v-checkbox
            v-model="isSelectAll"
            :indeterminate="modelSelected.length > 0 && !isSelectAll"
            hide-details
            density="compact"
            @change="handleSelectAll"
          ></v-checkbox>
        </td>
        <template v-for="column in tableHeaders" :key="column['key_name']">
          <td :style="columnStyle(column, true)" class="text-center">
            <span style="font-size: 18px; font-weight: bold">{{
                column["key_title"]
              }}</span>
          </td>
        </template>
      </tr>
    </template>
    <template v-slot:body="{ items }" style="position: relative">
      <template v-for="item in items">
        <tr @click="handleRowClick(item)" v-bind="props">
          <td
            v-if="showSelected"
            :style="
              columnStyle(
                { width: '50px', is_fixed: -1, fixedPx: 0 },
                false,
                item
              )
            "
          >
            <v-checkbox
              v-if="!item.haveFilter"
              :model-value="modelSelected.includes(item.id)"
              hide-details
              density="compact"
              @click="(e : any) => e.stopPropagation()"
              @change="(e : any) => handleSelectRow(e, item)"
            ></v-checkbox>
          </td>
          <template v-for="column in tableHeaders" :key="column['key_name']">
            <template v-if="column['key_name'] !== 'actions'">
              <td :style="columnStyle(column, false, item)">
                <template v-if="column['data_type'] === DataType.RELATION">
                  <template v-if="column['is_edit']">
                    <!--                  <v-tooltip location="top">-->
                    <!--                    <template v-slot:activator="{ props }">-->
                    <!--                      <v-select-->
                    <!--                        v-bind="props"-->
                    <!--                        :items="selectMap?.get(column['key_name'])"-->
                    <!--                        v-model="item[column['relate_table']]"-->
                    <!--                        density="compact"-->
                    <!--                        hide-details="auto"-->
                    <!--                        item-title="name"-->
                    <!--                        return-object-->
                    <!--                      ></v-select>-->
                    <!--                    </template>-->
                    <!--                    <span>{{ item[column['relate_table']]['relate_column'] }}</span>-->
                    <!--                  </v-tooltip>-->
                  </template>
                  <template v-else-if="item.haveFilter">
                    <v-text-field
                      v-model="columnFilter[column['key_name']]"
                      density="compact"
                      hide-details="auto"
                      type="text"
                      variant="solo-filled"
                      clearable
                    ></v-text-field>
                  </template>
                  <template v-else>
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <span v-bind="props" class="d-block text-right">
                          {{
                            item[column["relate_table"]]?.[
                              column["relate_column"]
                              ]
                          }}
                        </span>
                      </template>
                      <span>{{
                          item[column["relate_table"]]?.[column["relate_column"]]
                        }}</span>
                    </v-tooltip>
                  </template>
                </template>
                <template v-else-if="column['data_type'] === DataType.ENUM">
                  <template v-if="item.haveFilter">
                    <EnumInput
                      :editable="true"
                      :tooltip="false"
                      v-model="columnFilter[column['key_name']]"
                      :key-name="column['key_name']"
                      :variant="'solo-filled'"
                    />
                  </template>
                  <template v-else>
                    <EnumInput
                      :editable="column['is_edit']"
                      :tooltip="true"
                      v-model="item[column['key_name']]"
                      :key-name="column['key_name']"
                    />
                  </template>
                </template>
                <template
                  v-else-if="
                    column['data_type'] === DataType.INTEGER ||
                    column['data_type'] === DataType.LONG
                  "
                >
                  <template v-if="item.haveFilter">
                    <v-text-field
                      v-model="columnFilter[column['key_name']]"
                      density="compact"
                      hide-details="auto"
                      type="number"
                      variant="solo-filled"
                    ></v-text-field>
                  </template>
                  <template v-else>
                    <IntegerNumberInput
                      :editable="column['is_edit']"
                      :tooltip="true"
                      v-model="item[column['key_name']]"
                    />
                  </template>
                </template>
                <template v-else-if="column['data_type'] === DataType.DOUBLE">
                  <template v-if="item.haveFilter">
                    <v-text-field
                      v-model="columnFilter[column['key_name']]"
                      density="compact"
                      hide-details="auto"
                      type="number"
                      variant="solo-filled"
                    ></v-text-field>
                  </template>
                  <template v-else>
                    <FloatNumberInput
                      :editable="column['is_edit']"
                      :tooltip="true"
                      v-model="item[column['key_name']]"
                    />
                  </template>
                </template>
                <template v-else-if="column['data_type'] === DataType.IMAGE">
                  <template v-if="column['is_edit']"></template>
                  <template v-else>
                    <v-img
                      :src="item[column['key_name']]"
                      width="40"
                      height="40"
                      rounded
                    ></v-img>
                  </template>
                </template>
                <template v-else-if="column['data_type'] === DataType.DATETIME">
                  <!--                TODO: Datetime in table-->
                  <!--                <template v-if="column['is_edit']">-->
                  <!--                  <v-tooltip location="top">-->
                  <!--                    <template v-slot:activator="{ props }">-->
                  <!--                      <v-text-field-->
                  <!--                        v-model="item[column['key_name']]"-->
                  <!--                        hide-details="auto"-->
                  <!--                        type="text"-->
                  <!--                        v-bind="props"-->
                  <!--                        density="compact"-->
                  <!--                      ></v-text-field>-->
                  <!--                    </template>-->
                  <!--                    <span>{{ item[column['key_name']] }}</span>-->
                  <!--                  </v-tooltip>-->
                  <!--                </template>-->
                  <!--                <template v-else-if="item.haveFilter">-->
                  <!--                  <v-text-field-->
                  <!--                    v-model="columnFilter[column['key_name']]"-->
                  <!--                    density="compact"-->
                  <!--                    hide-details="auto"-->
                  <!--                    type="text"-->
                  <!--                    variant="solo-filled"-->
                  <!--                    clearable-->
                  <!--                  ></v-text-field>-->
                  <!--                </template>-->
                  <!--                <template v-else>-->
                  <!--                  <v-tooltip location="top">-->
                  <!--                    <template v-slot:activator="{ props }">-->
                  <!--                      <span v-bind="props" class="d-block text-right">-->
                  <!--                        {{ item[column['key_name']] }}-->
                  <!--                      </span>-->
                  <!--                    </template>-->
                  <!--                    <span>{{ item[column['key_name']] }}</span>-->
                  <!--                  </v-tooltip>-->
                  <!--                </template>-->
                </template>
                <template v-else-if="column['data_type'] === DataType.BOOLEAN">
                  <!--                TODO: Boolean in table-->
                  <!--                <template v-if="column['is_edit']">-->
                  <!--                  <v-tooltip location="top">-->
                  <!--                    <template v-slot:activator="{ props }">-->
                  <!--                      <v-text-field-->
                  <!--                        v-model="item[column['key_name']]"-->
                  <!--                        hide-details="auto"-->
                  <!--                        type="text"-->
                  <!--                        v-bind="props"-->
                  <!--                        density="compact"-->
                  <!--                      ></v-text-field>-->
                  <!--                    </template>-->
                  <!--                    <span>{{ item[column['key_name']] }}</span>-->
                  <!--                  </v-tooltip>-->
                  <!--                </template>-->
                  <!--                <template v-else-if="item.haveFilter">-->
                  <!--                  <v-text-field-->
                  <!--                    v-model="columnFilter[column['key_name']]"-->
                  <!--                    density="compact"-->
                  <!--                    hide-details="auto"-->
                  <!--                    type="text"-->
                  <!--                    variant="solo-filled"-->
                  <!--                    clearable-->
                  <!--                  ></v-text-field>-->
                  <!--                </template>-->
                  <!--                <template v-else>-->
                  <!--                  <v-tooltip location="top">-->
                  <!--                    <template v-slot:activator="{ props }">-->
                  <!--                      <span v-bind="props" class="d-block text-right">-->
                  <!--                        {{ item[column['key_name']] }}-->
                  <!--                      </span>-->
                  <!--                    </template>-->
                  <!--                    <span>{{ item[column['key_name']] }}</span>-->
                  <!--                  </v-tooltip>-->
                  <!--                </template>-->
                </template>
                <template v-else>
                  <template v-if="item.haveFilter">
                    <v-text-field
                      v-model="columnFilter[column['key_name']]"
                      density="compact"
                      hide-details="auto"
                      type="text"
                      variant="solo-filled"
                      clearable
                    ></v-text-field>
                  </template>
                  <template v-else>
                    <TextInput
                      :editable="column['is_edit']"
                      :tooltip="true"
                      v-model="item[column['key_name']]"
                    />
                  </template>
                </template>
              </td>
            </template>
            <template v-else>
              <td
                :style="{ ...columnStyle(column, false, item) }"
                class="text-center"
              >
                <template
                  v-if="!item.haveFilter"
                  v-for="action in rowActions"
                  :key="action.label"
                >
                  <v-btn
                    density="comfortable"
                    @click="action.action(item)"
                    rounded
                    class="mx-1"
                  >
                    <v-icon :icon="'mdi-' + action.icon"></v-icon>
                    {{ action.label }}
                  </v-btn>
                </template>
              </td>
            </template>
          </template>
        </tr>
      </template>
      <v-overlay
        :model-value="modelLoading"
        class="align-center justify-center"
        contained
      >
        <v-progress-circular
          color="primary"
          size="64"
          indeterminate
        ></v-progress-circular>
      </v-overlay>
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
  padding: 0 8px !important

.v-data-table__tbody
  position: relative
</style>
