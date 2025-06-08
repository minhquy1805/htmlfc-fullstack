import {
  Button,
  Form,
  Input,
  Card,
  Checkbox,
  Typography,
  message,
} from "antd";
import { loginApi } from "../services/api";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/slices/authSlice";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";

const { Text } = Typography;

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    const savedUsername = localStorage.getItem("savedUsername");
    if (savedUsername) {
      form.setFieldsValue({
        username: savedUsername,
        remember: true,
      });
    }
  }, [form]);

  const onFinish = async (values) => {
    try {
      const { accessToken, refreshToken } = await loginApi(values.username, values.password);

      // Lưu token và refreshToken
      if (values.remember) {
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("savedUsername", values.username);
      } else {
        sessionStorage.setItem("token", accessToken);
        sessionStorage.setItem("refreshToken", refreshToken);
        localStorage.removeItem("savedUsername");
      }

      // Giải mã accessToken
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const user = {
        id: payload.MemberId,
        username: payload.Username,
        role: payload.Role,
      };

      dispatch(login(user));
      message.success("Đăng nhập thành công!");
      navigate("/");

    } catch (err) {
      message.error("Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card title="Đăng nhập" style={{ width: 400 }}>
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ remember: false }}
        >
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
          >
            <Input placeholder="Nhập tên đăng nhập" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Ghi nhớ tôi</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Text type="secondary">Theo dõi chúng tôi trên các nền tảng:</Text>
          <div style={{ marginTop: 12, fontSize: 20 }}>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ margin: "0 10px", color: "#1877f2" }}
            >
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ margin: "0 10px", color: "#C13584" }}
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ margin: "0 10px", color: "#1da1f2" }}
            >
              <FontAwesomeIcon icon={faTwitter} />
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
