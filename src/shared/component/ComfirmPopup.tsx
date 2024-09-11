import { Modal, Button } from "antd";
import useConfirmPopupStore from "../../store/ConfirmPopupStore";

export default function ConfirmPopup() {
  const { title, content, show, submit, type, setShow } =
    useConfirmPopupStore();
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
