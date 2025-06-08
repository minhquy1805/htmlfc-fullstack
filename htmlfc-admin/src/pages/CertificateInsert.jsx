import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Typography,
  Select,
  message,
} from "antd";
import { insertCertificate, getCertificateTypes } from "../services/api";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Swal from "sweetalert2";

const { Title } = Typography;
const { Option } = Select;

export default function CertificateInsert() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [certificateTypes, setCertificateTypes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await getCertificateTypes();
        setCertificateTypes(types);
      } catch {
        message.error("Không thể tải danh sách loại chứng chỉ.");
      }
    };
    fetchTypes();
  }, []);

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      dateCert: values.dateCert.toISOString(),
      certificateId: 0,
      field1: "string",
      field2: "string",
      field3: "string",
      field4: "string",
      field5: "string",
      flag: "s",
    };

    try {
      setLoading(true);
      await insertCertificate(payload);

      await Swal.fire({
        icon: "success",
        title: "Đã thêm chứng chỉ!",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/certificate");
    } catch (err) {
      Swal.fire("Lỗi", "Không thể thêm chứng chỉ!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <Title level={3}>Thêm chứng chỉ mới</Title>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input placeholder="Tiêu đề chứng chỉ" />
        </Form.Item>

        <Form.Item
          name="certificateTypeId"
          label="Loại chứng chỉ"
          rules={[{ required: true, message: "Vui lòng chọn loại" }]}
        >
          <Select placeholder="Chọn loại chứng chỉ">
            {certificateTypes.map((type) => (
              <Option key={type.certificateTypeId} value={type.certificateTypeId}>
                {type.certificateTitle}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="contentCert" label="Nội dung chứng chỉ">
          <Input.TextArea rows={3} placeholder="Nhập nội dung..." />
        </Form.Item>

        <Form.Item
          name="dateCert"
          label="Ngày cấp"
          rules={[{ required: true, message: "Vui lòng chọn ngày cấp" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="signCert" label="Người ký">
          <Input placeholder="Tên người ký" />
        </Form.Item>

        <Form.Item name="reasonCert" label="Lý do cấp">
          <Input placeholder="Lý do cấp chứng chỉ" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Thêm chứng chỉ
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
