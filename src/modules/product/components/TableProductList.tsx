import { Button, Table, TablePaginationConfig } from "antd";
import { EyeOutlined, DeleteFilled } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import {
  checkViewToShow,
  getViewByViewName,
} from "../../../services/ViewService";
import useToastStore from "../../../store/ToastStore";
import { deleteProduct, searchProduct } from "../../../services/ProductService";
import useConfirmPopupStore from "../../../store/ConfirmPopupStore";
import { ActionProductList } from "./ActionProductList";
import ProductPopup from "./ProductPopup";

export default function TableProductList({
  filter,
  setFilter,
}: {
  filter: any;
  setFilter: any;
}) {
  // Constants
  const viewName = "product_list";
  // Hooks
  const { setShow, setContent, setTitle, setSubmit, setType } =
    useConfirmPopupStore();
  const { setToast } = useToastStore();
  const [views, setViews] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataCount, setDataCount] = useState<number>(0);
  const [productPopupShow, setProductPopupShow] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);

  useEffect(() => {
    getViewByViewName(viewName)
      .then((res) => {
        let data = checkViewToShow(res.data.data, filter, setFilter);
        data.push({
          key: 99999,
          title: "Thao tác",
          fixed: "right",
          width: "120px",
          render: (text: any, record: any) => {
            return (
              <div>
                <Button
                  type="primary"
                  shape="circle"
                  icon={<EyeOutlined />}
                  style={{ marginRight: 10 }}
                  onClick={() => {
                    setCurrentProduct(record);
                    setProductPopupShow(true);
                  }}
                />
                <Button
                  type="primary"
                  danger
                  shape="circle"
                  icon={<DeleteFilled />}
                  onClick={() => {
                    setType("danger");
                    setTitle("Xóa sản phẩm");
                    setContent("Bạn có chắc chắn muốn xóa sản phẩm này ?");
                    setSubmit(() => {
                      setLoading(true);
                      deleteProduct(record.id)
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
                    });
                    setShow(true);
                  }}
                />
              </div>
            );
          },
        });
        setViews(data);
      })
      .catch((err) => {
        setToast({
          show: true,
          content: err.response.data.result.message,
          type: "error",
        });
      });
  }, []);

  useEffect(() => {
    for (let key in filter.filter) {
      let isDeleted = true;
      for (let k in filter.filter[key]) {
        let value = filter.filter[key][k];
        if (value !== undefined && value !== "" && value !== null) {
          isDeleted = false;
        }
      }
      if (isDeleted) {
        delete filter.filter[key];
      }
    }
    setLoading(true);
    searchProduct(viewName, filter)
      .then((res) => {
        let data = res.data.data;
        for (let i = 0; i < data.length; i++) {
          data[i]["key"] = data[i]["id"];
        }
        setDataCount(res.data.data_count);
        setData(data);
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
  }, [filter]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: any,
    sorter: any
  ) => {
    let sortOrder = sorter["order"];
    if (sortOrder === "ascend") {
      sortOrder = "asc";
    } else if (sortOrder === "descend") {
      sortOrder = "desc";
    }

    setFilter({
      ...filter,
      filter: {
        ...filter.filter,
        [sorter["field"]]: {
          ...filter.filter[sorter["field"]],
          sort_order: sortOrder,
        },
      },
    });
  };

  return (
    <>
      <ActionProductList
        selectedRowKeys={selectedRowKeys}
        filter={filter}
        setFilter={setFilter}
        setLoading={setLoading}
        setCurrentProduct={setCurrentProduct}
        setProductPopupShow={setProductPopupShow}
      />
      <Table
        rowSelection={{
          type: "checkbox",
          selectedRowKeys: selectedRowKeys,
          onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
          },
        }}
        columns={views}
        dataSource={data}
        pagination={{
          pageSize: filter["page_size"],
          total: dataCount,
          position: ["bottomCenter"],
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            setFilter({
              ...filter,
              page_number: page - 1,
              page_size: pageSize,
            });
          },
          onShowSizeChange: (current, size) => {
            setFilter({ ...filter, page_number: 0, page_size: size });
          },
        }}
        scroll={{ y: "calc(100vh - 240px)" }}
        loading={loading}
        bordered
        onChange={handleTableChange}
      />
      <ProductPopup
        productPopupShow={productPopupShow}
        setProductPopupShow={setProductPopupShow}
        currentProduct={currentProduct}
        filter={filter}
        setFilter={setFilter}
      />
    </>
  );
}
