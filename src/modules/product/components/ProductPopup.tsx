import { Button, Col, Form, FormProps, Input, Modal, Row } from "antd";
import { useEffect, useState } from "react";
import { getProduct, saveProduct } from "../../../services/ProductService";
import useToastStore from "../../../store/ToastStore";
import { getViewByViewName } from "../../../services/ViewService";
import { DataType } from "../../../utils/Constant";
import CheckViewToShowForm from "../../../shared/component/CheckViewToShowForm";

export default function ProductPopup({
  productPopupShow,
  setProductPopupShow,
  currentProduct,
  filter,
  setFilter,
}: {
  productPopupShow: boolean;
  setProductPopupShow: any;
  currentProduct: any;
  filter: any;
  setFilter: any;
}) {
  const viewName = "product_popup";
  const [loading, setLoading] = useState<boolean>(false);
  const [views, setViews] = useState<any[]>([]);
  const [product, setProduct] = useState<any>({});
  const [relationDatas, setRelationDatas] = useState<any>({});
  const [form] = Form.useForm<any>();
  const { setToast } = useToastStore();

  useEffect(() => {
    if (productPopupShow) {
      setLoading(true);
      getViewByViewName(viewName)
        .then((res) => {
          setViews(res.data.data);
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
    } else {
      form.resetFields();
      setProduct({});
    }
  }, [productPopupShow]);

  useEffect(() => {
    if (currentProduct) {
      getProduct(currentProduct.id)
        .then((res) => {
          const data = res.data.data;
          for (let view of views) {
            if (view["data_type"] === DataType.RELATION) {
              if (data[view["relate_table"]]) {
                data[view["relate_table"]] = {
                  ...data[view["relate_table"]],
                  label: data[view["relate_table"]][view["relate_column"]],
                  key: data[view["relate_table"]]["id"],
                };
                setRelationDatas({
                  ...relationDatas,
                  [view["relate_table"]]: [
                    {
                      ...data[view["relate_table"]],
                    },
                  ],
                });
              } else {
                setRelationDatas({
                  ...relationDatas,
                  [view["relate_table"]]: [],
                });
              }
            }
          }
          form.setFieldsValue(data);
          setProduct(data);
        })
        .catch((err) => {
          setToast({
            show: true,
            content: err.response.data.result.message,
            type: "error",
          });
        });
    }
  }, [currentProduct, views]);

  const onFinish: FormProps<any>["onFinish"] = (values) => {
    let data = { ...product, ...values };
    saveProduct(data)
      .then((res) => {
        switch (product.action) {
          case "save":
            setProductPopupShow(false);
            break;
          case "save&create":
            form.resetFields();
            break;
          case "save&copy":
            setProduct({
              ...product,
              id: null,
            });
            break;
        }

        setFilter({ ...filter });
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
      });
  };

  return (
    <Modal
      loading={loading}
      title="Thông tin sản phẩm"
      open={productPopupShow}
      onCancel={() => setProductPopupShow(false)}
      footer={[
        <Button key="cancel" onClick={() => setProductPopupShow(false)}>
          Hủy bỏ
        </Button>,
        <Button
          type="primary"
          key="save"
          onClick={() => {
            setProduct({
              ...product,
              action: "save",
            });
            form.submit();
          }}
        >
          Lưu
        </Button>,
        <Button
          key="save&create"
          type="primary"
          onClick={() => {
            setProduct({
              ...product,
              action: "save&create",
            });
            form.submit();
          }}
        >
          Lưu và thêm mới
        </Button>,
        <Button
          key="save&copy"
          type="primary"
          onClick={() => {
            setProduct({
              ...product,
              action: "save&copy",
            });
            form.submit();
          }}
        >
          Lưu và sao chép
        </Button>,
      ]}
      width={1000}
    >
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Row gutter={16}>
          {views?.map((view, index) => (
            <CheckViewToShowForm
              key={index}
              view={view}
              form={form}
              relationDatas={relationDatas}
              setRelationDatas={setRelationDatas}
            />
          ))}
        </Row>
      </Form>
    </Modal>
  );
}
