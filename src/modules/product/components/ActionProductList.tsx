import { Button, Card, Checkbox, Space } from "antd";
import {
  PlusCircleOutlined,
  DeleteFilled,
  CloseOutlined,
  ImportOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import useConfirmPopupStore from "../../../store/ConfirmPopupStore";
import { deleteMultiProduct } from "../../../services/ProductService";
import useToastStore from "../../../store/ToastStore";
import { useState } from "react";
import ImportFileExcel from "./ImportFileExcel";
import {
  exportExcel,
  getExcelTemplate,
  importExcel,
} from "../../../services/ExcelService";

export const ActionProductList = ({
  selectedRowKeys,
  filter,
  setFilter,
  setLoading,
  setCurrentProduct,
  setProductPopupShow,
}: {
  selectedRowKeys: any[];
  filter: any;
  setFilter: any;
  setLoading: any;
  setCurrentProduct: any;
  setProductPopupShow: any;
}) => {
  const viewName = "product_popup";
  const { setShow, setContent, setTitle, setSubmit, setType } =
    useConfirmPopupStore();
  const [importFileExcelShow, setImportFileExcelShow] =
    useState<boolean>(false);
  const { setToast } = useToastStore();
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 6,
      }}
    >
      <div>
        <Button
          type="primary"
          icon={<CloseOutlined />}
          style={{ marginRight: 10 }}
          onClick={() => {
            setFilter({
              page_number: 0,
              page_size: 20,
              filter: {},
              common: "",
              sort_property: "",
              sort_order: "",
            });
          }}
        >
          Bộ lọc
        </Button>
      </div>
      <div>
        <Button
          type="primary"
          icon={<ImportOutlined />}
          style={{ marginRight: 10, backgroundColor: "#006600" }}
          onClick={() => {
            setImportFileExcelShow(true);
          }}
        >
          Import
        </Button>
        <Button
          type="primary"
          icon={<ExportOutlined />}
          style={{ marginRight: 10, backgroundColor: "#006600" }}
          onClick={() => {
            setLoading(true);
            exportExcel(viewName)
              .then((res) => {
                const url = window.URL.createObjectURL(
                  new Blob([res.data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  })
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "export.xlsx");
                document.body.appendChild(link);
                link.click();
                setToast({
                  show: true,
                  content: "Export thành công",
                  type: "success",
                });
              })
              .catch((err) => {
                setToast({
                  show: true,
                  content: err.response.data.result.message,
                  type: "error",
                });
              })
              .finally(() => {
                setLoading(false);
              });
          }}
        >
          Export
        </Button>
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          style={{ marginRight: 10 }}
          onClick={() => {
            setCurrentProduct(null);
            setProductPopupShow(true);
          }}
        >
          Thêm mới
        </Button>
        <Button
          type="primary"
          danger
          style={{ marginRight: 10 }}
          icon={<DeleteFilled />}
          onClick={() => {
            setType("danger");
            setTitle("Xóa các sản phẩm đã chọn");
            setContent("Bạn có chắc chắn muốn xóa các sản phẩm đã chọn ?");
            setSubmit(() => {
              setLoading(true);
              deleteMultiProduct(selectedRowKeys)
                .then((res) => {
                  setToast({
                    show: true,
                    content: res.data.result.message,
                    type: "success",
                  });
                })
                .catch((err) => {
                  setToast({
                    show: true,
                    content: err.response.data.result.message,
                    type: "error",
                  });
                })
                .finally(() => {
                  setFilter({ ...filter });
                  setLoading(false);
                });
              setShow(false);
              setShow(false);
            });
            setShow(true);
          }}
        >
          Xóa
        </Button>
      </div>
      <ImportFileExcel
        show={importFileExcelShow}
        setShow={setImportFileExcelShow}
        submit={(file: any) => {
          if (!file) {
            setToast({
              show: true,
              content: "Chưa chọn file",
              type: "error",
            });
            return;
          }
          setLoading(true);
          importExcel(viewName, file)
            .then((res) => {
              setToast({
                show: true,
                content: res.data.result.message,
                type: "success",
              });
              setImportFileExcelShow(false);
            })
            .catch((err) => {
              setToast({
                show: true,
                content: err.response.data.result.message,
                type: "error",
              });
            })
            .finally(() => {
              setFilter({ ...filter });
              setLoading(false);
            });
        }}
        get={() => {
          setLoading(true);
          getExcelTemplate(viewName)
            .then((res) => {
              const url = window.URL.createObjectURL(
                new Blob([res.data], {
                  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                })
              );
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", "template.xlsx");
              document.body.appendChild(link);
              link.click();
              setToast({
                show: true,
                content: "Tải file mẫu thành công",
                type: "success",
              });
            })
            .catch((err) => {
              setToast({
                show: true,
                content: err.response.data.result.message,
                type: "error",
              });
            })
            .finally(() => {
              setLoading(false);
            });
        }}
      />
    </div>
  );
};
