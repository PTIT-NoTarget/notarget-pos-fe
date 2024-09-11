import { Button, Modal, Upload } from "antd";
import { useEffect, useState } from "react";
import { InboxOutlined, TableOutlined } from "@ant-design/icons";
import useToastStore from "../../../store/ToastStore";

export default function ImportFileExcel({
  show,
  setShow,
  submit,
  get,
}: {
  show: boolean;
  setShow: any;
  submit: any;
  get: any;
}) {
  const [file, setFile] = useState<any>(null);
  const { setToast } = useToastStore();
  useEffect(() => {
    if (!show) {
      setFile(null);
    }
  }, [show]);

  return (
    <Modal
      title="Import"
      open={show}
      onCancel={() => setShow(false)}
      footer={[
        <Button key="cancel" onClick={() => setShow(false)}>
          Hủy bỏ
        </Button>,
        <Button
          key="template"
          type="primary"
          onClick={() => get()}
          style={{ backgroundColor: "#006600" }}
        >
          Tải file mẫu
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            submit(file);
          }}
        >
          Xác nhận
        </Button>,
      ]}
      width={600}
    >
      <Upload.Dragger
        multiple={false}
        showUploadList={false}
        name="file"
        action=""
        onChange={(info) => {
          if (info.file.originFileObj) {
            setFile(info.file.originFileObj);
          }
        }}
        beforeUpload={(file: any) => {
          const isXlsx =
            file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
          if (!isXlsx) {
            setToast({
              show: true,
              content: "Chỉ hỗ trợ file excel",
              type: "error",
            });
          }
          return isXlsx;
        }}
      >
        {file ? (
          <>
            <TableOutlined />
            <p>{file.name}</p>
          </>
        ) : (
          <>
            <InboxOutlined />
            <p>Nhấn hoặc kéo thả file vào đây để upload</p>
            <p>Chỉ hỗ trợ file excel</p>
          </>
        )}
      </Upload.Dragger>
    </Modal>
  );
}
