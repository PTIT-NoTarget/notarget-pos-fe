import { Button, Checkbox, Input, Menu, MenuProps } from "antd";
import {
  SearchOutlined,
  FolderOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import { use } from "echarts";
import { useCallback, useEffect, useState } from "react";
import { debounce, set } from "lodash";
import InputPopup from "../../../shared/component/InputPopup";
import useLoadingStore from "../../../store/LoadingStore";
import useToastStore from "../../../store/ToastStore";
import {
  deleteProductType,
  saveProductType,
  searchProductType,
} from "../../../services/ProductService";
import useConfirmPopupStore from "../../../store/ConfirmPopupStore";
import "../assets/FilterProductList.css";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

export default function FilterProductList({
  filter,
  setFilter,
}: {
  filter: any;
  setFilter: any;
}) {
  const viewName = "group_product_type";
  const { setLoading } = useLoadingStore();
  const { setToast } = useToastStore();
  const { setShow, setContent, setTitle, setSubmit, setType } =
    useConfirmPopupStore();
  const [inputPopupShow, setInputPopupShow] = useState<boolean>(false);
  const [newProductGroup, setNewProductGroup] = useState<any>({});
  const [productGroupMenuItems, setProductGroupMenuItems] = useState<
    MenuItem[]
  >([]);
  const [checkedProductGroup, setCheckedProductGroup] = useState<Set<any>>(
    new Set()
  );
  const [reload, setReload] = useState<boolean>(false);

  const debouncedSetFilter = useCallback(
    debounce((value: any) => {
      setFilter({ ...filter, common: value });
    }, 300),
    [filter, setFilter]
  );

  const searchMenuItems: MenuItem[] = [
    getItem("Tìm kiếm", "search", <SearchOutlined />, [
      getItem(
        <Input.Search
          autoFocus
          onChange={(e) => {
            debouncedSetFilter(e.target.value);
          }}
        />,
        "search-input"
      ),
    ]),
  ];

  useEffect(() => {
    if (checkedProductGroup.size > 0) {
      let productTypeIds = Array.from(checkedProductGroup);
      setFilter({
        ...filter,
        filter: {
          ...filter.filter,
          product_type_id: {
            value: productTypeIds,
            operator: "in",
          },
        },
      });
    } else {
      delete filter.filter.product_type_id;
      setFilter({ ...filter });
    }
  }, [checkedProductGroup]);

  useEffect(() => {
    searchProductType(viewName, {
      filter: {},
      sort_property: "id",
      sort_order: "asc",
    })
      .then((response) => {
        const data = response.data.data;
        const items: MenuItem[] = data.map((item: any) =>
          getItem(
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Checkbox
                onChange={(e) => {
                  if (e.target.checked) {
                    setCheckedProductGroup((prevCheckedProductGroup) => {
                      const newCheckedProductGroup = new Set(
                        prevCheckedProductGroup
                      );
                      newCheckedProductGroup.add(item.id);
                      return newCheckedProductGroup;
                    });
                  } else {
                    setCheckedProductGroup((prevCheckedProductGroup) => {
                      const newCheckedProductGroup = new Set(
                        prevCheckedProductGroup
                      );
                      newCheckedProductGroup.delete(item.id);
                      return newCheckedProductGroup;
                    });
                  }
                }}
              >
                {item.type_name}
              </Checkbox>
              <div>
                <Button
                  size="small"
                  shape="circle"
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setNewProductGroup(item);
                    setInputPopupShow(true);
                  }}
                  style={{ marginRight: 5 }}
                />
                <Button
                  size="small"
                  shape="circle"
                  type="primary"
                  icon={<DeleteFilled />}
                  danger
                  onClick={() => {
                    setShow(true);
                    setType("danger");
                    setTitle("Xóa nhóm hàng hóa");
                    setContent("Bạn có chắc chắn muốn xóa nhóm hàng hóa này ?");
                    setSubmit(() => {
                      setLoading(true);
                      deleteProductType(item.id)
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
                          setReload(!reload);
                          setFilter({ ...filter });
                          setLoading(false);
                        });
                      setShow(false);
                    });
                  }}
                />
              </div>
            </div>,
            item.id
          )
        );
        setProductGroupMenuItems([
          getItem(
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              Nhóm hàng hóa
              <Button
                size="small"
                shape="circle"
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  setInputPopupShow(true);
                }}
              />
            </div>,
            "list-product-group",
            <FolderOutlined />,
            items
          ),
        ]);
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
  }, [reload]);

  return (
    <>
      <Menu
        inlineIndent={0}
        mode="inline"
        items={searchMenuItems}
        defaultOpenKeys={["search"]}
      ></Menu>
      <Menu
        inlineIndent={0}
        mode="inline"
        items={productGroupMenuItems}
        defaultOpenKeys={["list-product-group"]}
        style={{ maxHeight: "500px", overflowY: "auto" }}
      ></Menu>
      <InputPopup
        title="Thêm nhóm hàng hóa"
        content={
          <Input
            placeholder="Nhập tên nhóm hàng hóa"
            onChange={(e) =>
              setNewProductGroup({
                ...newProductGroup,
                type_name: e.target.value,
              })
            }
            value={newProductGroup["type_name"]}
          />
        }
        submit={() => {
          setLoading(true);
          saveProductType(newProductGroup)
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
              setReload(!reload);
              setFilter({ ...filter });
              setLoading(false);
            });
          setInputPopupShow(false);
          setNewProductGroup({});
        }}
        show={inputPopupShow}
        setShow={setInputPopupShow}
      />
    </>
  );
}
