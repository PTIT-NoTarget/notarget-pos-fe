import {
  Button,
  Card,
  Checkbox,
  Form,
  FormProps,
  Input,
  Typography,
} from "antd";
import { useEffect } from "react";
import { signIn } from "../../../services/AuthService";
import useToastStore from "../../../store/ToastStore";
import { useNavigate } from "react-router-dom";

type FieldType = {
  username?: string;
  password?: string;
  remember_me?: string;
};

export default function SignInPage({
  pageInformation,
}: {
  pageInformation: any;
}) {
  const { setToast } = useToastStore();
  const navigate = useNavigate();
  const [form] = Form.useForm<FieldType>();
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    signIn(values)
      .then((res) => {
        let data = res.data.data;
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        setToast({
          show: true,
          content: res.data.result.message,
          type: "success",
        });
        navigate("/home");
      })
      .catch((error) => {
        setToast({
          show: true,
          content: error.response.data.result.message,
          type: "error",
        });
      });
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {};

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        form.submit();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [form]);

  return (
    <div>
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: `url(${pageInformation["sign_in_background"]})`,
          backgroundSize: "cover",
        }}
      >
        <Card style={{ width: "30%", zIndex: 100 }}>
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember_me: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Typography.Title level={2} style={{ textAlign: "center" }}>
              {pageInformation["sign_in_title"]}
            </Typography.Title>
            <Form.Item<FieldType>
              label={pageInformation["sign_in_username"]}
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label={pageInformation["sign_in_password"]}
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item<FieldType>
              name="remember_me"
              valuePropName="checked"
              wrapperCol={{ offset: 8, span: 16 }}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                {pageInformation["sign_in_title"]}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu đen với độ mờ 50%
          zIndex: 1,
        }}
      ></div>
    </div>
  );
}
