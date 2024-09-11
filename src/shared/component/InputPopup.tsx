import { Modal, Button } from "antd";

export default function ConfirmPopup({
  title,
  content,
  submit,
  type = "normal",
  show,
  setShow,
}: {
  title: string;
  content: any;
  submit: () => void;
  type?: "normal" | "danger";
  show: boolean;
  setShow: (show: boolean) => void;
}) {
  return (
    <Modal
      title={title}
      open={show}
      onCancel={() => setShow(false)}
      footer={[
        <Button
          key="cancel"
          onClick={() => setShow(false)}
          danger={type === "danger"}
        >
          Hủy bỏ
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={submit}
          danger={type === "danger"}
        >
          Xác nhận
        </Button>,
      ]}
    >
      <p>{content}</p>
    </Modal>
  );
}
