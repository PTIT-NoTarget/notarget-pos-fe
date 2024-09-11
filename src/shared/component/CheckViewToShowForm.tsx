import { Avatar, Col, Form, Input, InputNumber, Select, Upload } from "antd";
import { DataType } from "../../utils/Constant";
import { getAutoComplete } from "../../services/CustomService";
import { UploadOutlined } from "@ant-design/icons";
import useToastStore from "../../store/ToastStore";
import { useState } from "react";

export default function CheckViewToShowForm({
  view,
  form,
  relationDatas,
  setRelationDatas,
}: {
  view: any;
  form: any;
  relationDatas: any;
  setRelationDatas: any;
}) {
  const { setToast } = useToastStore();
  const [imageUrl, setImageUrl] = useState<string>("");
  switch (view["data_type"]) {
    case DataType.STRING:
      return (
        <Col span={12} key={view["id"]}>
          <Form.Item<any>
            label={view["key_title"]}
            labelAlign="left"
            name={view["key_name"]}
          >
            <Input placeholder={view["key_title"]} />
          </Form.Item>
        </Col>
      );
    case DataType.LONG_STRING:
      return (
        <Col span={24} key={view["id"]}>
          <Form.Item<any>
            label={view["key_title"]}
            labelAlign="left"
            name={view["key_name"]}
          >
            <Input.TextArea
              placeholder={view["key_title"]}
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>
        </Col>
      );
    case DataType.INTEGER:
    case DataType.LONG:
      return (
        <Col span={12} key={view["id"]}>
          <Form.Item<any>
            label={view["key_title"]}
            labelAlign="left"
            name={view["key_name"]}
          >
            <InputNumber<number>
              placeholder={view["key_title"]}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) =>
                value?.replace(/\$\s?|(,*)/g, "") as unknown as number
              }
              style={{ width: "100%" }}
              onKeyDown={(event) => {
                let allowKeys = [
                  "Backspace",
                  "Delete",
                  "ArrowLeft",
                  "ArrowRight",
                  "0",
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                ];
                if (!allowKeys.includes(event.key)) {
                  event.preventDefault();
                }
              }}
            />
          </Form.Item>
        </Col>
      );
    case DataType.DOUBLE:
      return (
        <Col span={12} key={view["id"]}>
          <Form.Item<any>
            label={view["key_title"]}
            labelAlign="left"
            name={view["key_name"]}
          >
            <InputNumber<number>
              placeholder={view["key_title"]}
              formatter={(value) =>
                `${value}`
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  .replace(/(\.\d{2})\d+/, "$1")
              }
              parser={(value) => {
                const parsedValue = parseFloat(
                  value?.replace(/\$\s?|(,*)/g, "") as string
                );
                return Number.isNaN(parsedValue)
                  ? 0
                  : parseFloat(parsedValue.toFixed(2));
              }}
              style={{ width: "100%" }}
              onKeyDown={(event) => {
                let allowKeys = [
                  "Backspace",
                  "Delete",
                  "ArrowLeft",
                  "ArrowRight",
                  "0",
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  ".",
                ];
                if (!allowKeys.includes(event.key)) {
                  event.preventDefault();
                }
              }}
            />
          </Form.Item>
        </Col>
      );
    case DataType.IMAGE:
      const beforeUpload = (file: any) => {
        const isJpgOrPng =
          file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
          setToast({
            show: true,
            content: "You can only upload JPG/PNG file!",
            type: "error",
          });
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          setToast({
            show: true,
            content: "Image must smaller than 2MB!",
            type: "error",
          });
        }
        return isJpgOrPng && isLt2M;
      };

      const imageView = () => {
        if (imageUrl) {
          return (
            <Avatar src={form.getFieldValue(view["key_name"])} size={100} />
          );
        } else {
          if (form.getFieldValue(view["key_name"])) {
            return (
              <Avatar src={form.getFieldValue(view["key_name"])} size={100} />
            );
          } else {
            return (
              <button style={{ border: 0, background: "none" }} type="button">
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </button>
            );
          }
        }
      };

      return (
        <>
          <Col span={4} key={view["id"] + "upload"}>
            <Upload
              name="file"
              listType="picture-circle"
              className="avatar-uploader"
              showUploadList={false}
              action="http://localhost:8000/api/v1/image/upload"
              beforeUpload={beforeUpload}
              onChange={(info: any) => {
                if (info.file.status === "done") {
                  const newImageUrl = info.file.response.data;
                  setImageUrl(newImageUrl);
                  form.setFieldsValue({
                    [view["key_name"]]: newImageUrl,
                  });
                }
              }}
            >
              {imageView()}
            </Upload>
          </Col>
          <Col span={20} key={view["id"] + "input"}>
            <Form.Item<any>
              label={view["key_title"]}
              labelAlign="left"
              name={view["key_name"]}
            >
              <Input
                placeholder={view["key_title"]}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                }}
              />
            </Form.Item>
          </Col>
        </>
      );
    case DataType.RELATION:
      return (
        <Col span={12} key={view["id"]}>
          <Form.Item
            name={view["relate_table"]}
            label={view["key_title"]}
            labelAlign="left"
          >
            <Select
              placeholder={view["key_title"]}
              allowClear
              showSearch
              options={relationDatas[view["relate_table"]]}
              onChange={(value: any, option: any) => {
                form.setFieldsValue({
                  [view["relate_table"]]: option,
                });
              }}
              onDropdownVisibleChange={() => {
                getAutoComplete(
                  view["relate_table"],
                  view["relate_column"],
                  ""
                ).then((res) => {
                  let data = res.data.data.map((item: any) => {
                    return {
                      ...item,
                      label: item[view["relate_column"]],
                      value: item["id"],
                    };
                  });
                  setRelationDatas({
                    ...relationDatas,
                    [view["relate_table"]]: data,
                  });
                });
              }}
            />
          </Form.Item>
        </Col>
      );
    default:
      return <></>;
  }
}
