import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Form, Input, Button, Typography, Image, Select, Tag, message, Skeleton } from "antd";
import { getMemberById, updateMember } from "../services/api";
import { Space } from "antd";

const { Title } = Typography;
const { Option } = Select;

export default function MemberDetail() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMemberById(id);
        setMember(res);
        form.setFieldsValue(res);
      } catch (err) {
        message.error("Không thể tải dữ liệu thành viên.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, form]);

  const handleUpdate = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      const updated = { ...member, ...values };
      await updateMember(updated);
      message.success("Cập nhật thành công!");
      setMember(updated);
    } catch (err) {
      message.error("Cập nhật thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Skeleton active />;

  return (
    <div>
      <Title level={3}>Thông tin chi tiết thành viên</Title>

      <Form form={form} layout="vertical">
        <Form.Item label="Họ và tên">
           <Space.Compact style={{ width: "100%" }}>
                <Form.Item name="firstName" noStyle>
                    <Input placeholder="Họ" style={{ width: "30%" }} />
                </Form.Item>
                <Form.Item name="middleName" noStyle>
                    <Input placeholder="Tên đệm" style={{ width: "30%" }} />
                </Form.Item>
                <Form.Item name="lastName" noStyle>
                    <Input placeholder="Tên" style={{ width: "40%" }} />
                </Form.Item>
            </Space.Compact>
        </Form.Item>

        <Form.Item name="email" label="Email">
          <Input />
        </Form.Item>

        <Form.Item name="phone" label="SĐT">
          <Input />
        </Form.Item>

        <Form.Item name="facebook" label="Facebook">
          <Input />
        </Form.Item>

        <Form.Item name="address" label="Địa chỉ">
          <Input />
        </Form.Item>

        <Form.Item name="role" label="Vai trò">
          <Select>
            <Option value="Admin">Admin</Option>
            <Option value="User">User</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Trạng thái">
          {member.flag === "T" ? (
            <Tag color="green">✔️ Đã xác thực</Tag>
          ) : (
            <Tag color="red">❌ Chưa xác thực</Tag>
          )}
        </Form.Item>

        <Form.Item label="Ảnh đại diện">
          <Image width={100} src={member.avatar} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={handleUpdate} loading={submitting}>
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
