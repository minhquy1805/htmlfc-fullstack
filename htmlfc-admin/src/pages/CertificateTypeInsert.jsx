import { useState } from "react";
import { Button, Form, Input, Typography, message } from "antd";
import { insertCertificateType } from "../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

export default function CertificateTypeInsert() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const payload = {
      certificateTypeId: 0,
      certificateTitle: values.certificateTitle,
    };

    try {
      setLoading(true);
      await insertCertificateType(payload);
      await Swal.fire({
        icon: "success",
        title: "Thêm thành công!",
        showConfirmButton: false,
        timer: 1500,
      });
      form.resetFields();
      navigate("/certificate-type"); // 👈 hoặc điều hướng về danh sách
    } catch (err) {
      message.error("Thêm loại chứng chỉ thất bại.");
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể thêm loại chứng chỉ.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <Title level={3}>Thêm loại chứng chỉ</Title>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Tên loại chứng chỉ"
          name="certificateTitle"
          rules={[{ required: true, message: "Vui lòng nhập tên loại chứng chỉ" }]}
        >
          <Input placeholder="Nhập tên loại chứng chỉ" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Thêm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
