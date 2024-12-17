<script setup lang="ts">
import { ExcelService } from "@/services/ExcelService";
import { EmployeeService } from "@/services/EmployeeService";
import { ViewService } from "@/services/ViewService";
import { useToastStore } from "@/stores/toast";
import { useLoadingStore } from "@/stores/loading";
import { debounce } from "lodash";
import { DataType } from "@/utils/Constant";
import { CustomService } from "@/services/CustomService";
import { CustomerService } from "@/services/CustomerService";

const rowActions = ref<any[]>([
  {
    icon: "pencil",
    label: "",
    action: (item: any) => openEditPopup(item),
  },
  {
    icon: "delete",
    label: "",
    action: (item: any) => openDeletePopup(item),
  },
]);
const tableActions = ref<any[]>([
  {
    icon: "import",
    label: "Import",
    action: () => openPopupImport(),
  },
  {
    icon: "export",
    label: "Export",
    action: () => exportData(),
  },
  {
    icon: "plus-circle-outline",
    label: "Thêm",
    action: () => openAddPopup(),
  },
  {
    icon: "delete",
    label: "Xóa",
    action: () => openDeleteMultiPopup(),
  },
]);
const headers = ref<any[]>([]);
const items = ref<any[]>([]);
const selected = ref<any[]>([]);
const viewName = "employee_list";
const formViewName = "employee_form_popup";
const loading = ref<boolean>(false);
const filter = ref<any>({
  pageNumber: 1,
  pageSize: 20,
  common: "",
  filter: {},
});
const totalData = ref<number>(0);
const forms = ref<any[]>([]);
const record = ref<any>({});
const selectMap = ref<Map<string, any[]>>(new Map());

onMounted(() => {
  useLoadingStore().showLoading();
  ViewService.getViewByMultiViewName([viewName, formViewName])
    .then((res: any) => {
      headers.value = res.data.data[viewName];
      forms.value = res.data.data[formViewName];
      return EmployeeService.search(viewName, {
        ...filter.value,
        pageNumber: 0,
      });
    })
    .then((res: any) => {
      items.value = res.data.data;
      totalData.value = res.data.data_count;
    })
    .finally(() => {
      useLoadingStore().hideLoading();
    });
});

const getRecordList = debounce(() => {
  loading.value = true;
  EmployeeService.search(viewName, {
    ...filter.value,
    pageNumber: filter.value.pageNumber - 1,
  })
    .then((res: any) => {
      items.value = res.data.data;
      totalData.value = res.data.data_count;
    })
    .finally(() => {
      loading.value = false;
    });
}, 500);

const deletePopup = ref<boolean>(false);
const deleteItem = ref<any>({});
const openDeletePopup = (item: any) => {
  deleteItem.value = item;
  deletePopup.value = true;
};
const deleteRecord = () => {
  useLoadingStore().showLoading();
  EmployeeService.delete(deleteItem.value.id)
    .then(() => {
      getRecordList();
      useToastStore().showSuccess("Xóa nhân viên thành công");
      deletePopup.value = false;
    })
    .finally(() => {
      useLoadingStore().hideLoading();
    });
};

const deleteMultiPopup = ref<boolean>(false);
const openDeleteMultiPopup = () => {
  if (selected.value.length === 0) {
    useToastStore().showWarning("Chưa chọn nhân viên để xóa");
    return;
  }
  deleteMultiPopup.value = true;
};
const deleteMulti = () => {
  if (selected.value.length === 0) {
    useToastStore().showWarning("Chưa chọn nhân viên để xóa");
    return;
  }
  useLoadingStore().showLoading();
  EmployeeService.deleteMulti(selected.value)
    .then(() => {
      getRecordList();
      useToastStore().showSuccess("Xóa nhân viên thành công");
      deleteMultiPopup.value = false;
    })
    .finally(() => {
      selected.value = [];
      useLoadingStore().hideLoading();
    });
};

const recordPopup = ref<boolean>(false);
const isEmptyRecord = computed(() => {
  return Object.keys(record.value).length === 0;
});
const openAddPopup = () => {
  record.value = { is_new: true };
  recordPopup.value = true;
};
const openEditPopup = (item: any) => {
  recordPopup.value = true;
  CustomerService.get(item.id)
    .then((res: any) => {
      record.value = res.data.data;
    })
    .catch(() => {
      recordPopup.value = false;
    });
};

const exportData = () => {
  useLoadingStore().showLoading();
  ExcelService.exportExcel(viewName)
    .then((res) => {
      const url = window.URL.createObjectURL(
        new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "export.xlsx");
      document.body.appendChild(link);
      link.click();
      useToastStore().showSuccess("Export thành công");
    })
    .catch(() => {
      useToastStore().showError("Export thất bại");
    })
    .finally(() => {
      useLoadingStore().hideLoading();
    });
};

const changeSelectMap = debounce((form: any, common: string = "") => {
  if (form["data_type"] === DataType.RELATION) {
    CustomService.getAutoComplete(
      form["relate_table"],
      form["relate_column"],
      common,
    ).then((res) => {
      selectMap.value.set(form["relate_table"], res.data.data);
    });
  }
}, 400);

const saveRecord = () => {
  useLoadingStore().showLoading();
  EmployeeService.save(record.value)
    .then(() => {
      recordPopup.value = false;
      getRecordList();
      useToastStore().showSuccess("Lưu nhân viên thành công");
    })
    .finally(() => {
      useLoadingStore().hideLoading();
    });
};
const saveAndNewRecord = () => {
  useLoadingStore().showLoading();
  EmployeeService.save(record.value)
    .then(() => {
      getRecordList();
      record.value = { is_new: true };
      useToastStore().showSuccess("Lưu nhân viên thành công");
    })
    .finally(() => {
      useLoadingStore().hideLoading();
    });

};
const saveAndCopyRecord = () => {
  useLoadingStore().showLoading();
  EmployeeService.save(record.value)
    .then(() => {
      getRecordList();
      record.value = {
        ...record.value,
        is_new: true,
        id: null,
      };
      useToastStore().showSuccess("Lưu nhân viên thành công");
    })
    .finally(() => {
      useLoadingStore().hideLoading();
    });
};

const importPopup = ref<boolean>(false);
const openPopupImport = () => {
  importPopup.value = true;
};
const importExcel = (file: any) => {
  useLoadingStore().showLoading();
  ExcelService.importExcel(formViewName, file)
    .then(() => {
      getRecordList();
      useToastStore().showSuccess("Import thành công");
    })
    .finally(() => {
      useLoadingStore().hideLoading();
    });
};
const getExcelTemplate = () => {
  useLoadingStore().showLoading();
  ExcelService.getExcelTemplate(formViewName)
    .then((res) => {
      const url = window.URL.createObjectURL(
        new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "import.xlsx");
      document.body.appendChild(link);
      link.click();
      useToastStore().showSuccess("Tải mẫu thành công");
    })
    .finally(() => {
      useLoadingStore().hideLoading();
    });
};

watch(
  filter,
  () => {
    getRecordList();
  },
  {
    deep: true,
  },
);
</script>

<template>
  <v-row style="width: 100%; height: calc(100vh - 48px); padding: 8px">
    <v-col cols="12">
      <Table
        :height="800"
        :columns="headers"
        :items="items"
        :row-actions="rowActions"
        :highlight-row="true"
        :have-pagination="true"
        :show-selected="true"
        v-model:selected="selected"
        v-model:loading="loading"
        :table-actions="tableActions"
        :show-search="true"
        :filter="filter"
        :have-filter="true"
        :total-data="totalData"
        @handle-row-click="openEditPopup"
      ></Table>
    </v-col>
  </v-row>
  <v-dialog v-model="recordPopup" width="auto" @after-leave="record = {}">
    <v-card width="1000">
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="text-h5 text-medium-emphasis ps-2">Thông tin nhân viên</div>

        <v-btn
          icon="mdi-close"
          variant="text"
          @click="recordPopup = false"
        ></v-btn>
      </v-card-title>
      <v-card-text style="position: relative">
        <Form
          v-model:item="record"
          :forms="forms"
          :line-each-item="2"
          :column-number="2"
          :tooltip="false"
          :select-map="selectMap"
          @update:change-select-map="changeSelectMap"
        ></Form>
        <v-overlay
          :model-value="isEmptyRecord"
          class="align-center justify-center"
          contained
        >
          <v-progress-circular
            color="primary"
            size="64"
            indeterminate
          ></v-progress-circular>
        </v-overlay>
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" @click="recordPopup = false" variant="text">
          Hủy
        </v-btn>
        <v-btn color="primary" @click="saveRecord" variant="elevated">
          Lưu
        </v-btn>
        <v-btn color="primary" @click="saveAndNewRecord" variant="elevated">
          Lưu và thêm mới
        </v-btn>
        <v-btn color="primary" @click="saveAndCopyRecord" variant="elevated">
          Lưu và sao chép
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <ConfirmPopup
    v-model:visible="deletePopup"
    title="Xác nhận"
    content="Bạn có chắc chắn muốn xóa nhân viên này không?"
    type="error"
    @submit="deleteRecord"
  />
  <ConfirmPopup
    v-model:visible="deleteMultiPopup"
    title="Xác nhận"
    content="Bạn có chắc chắn muốn xóa những nhân viên này không?"
    type="error"
    @submit="deleteMulti"
  />
  <ImportExcelPopup
    v-model:visible="importPopup"
    title="Import nhân viên"
    @import="importExcel"
    @get="getExcelTemplate"
  ></ImportExcelPopup>
</template>

<style scoped lang="sass"></style>
