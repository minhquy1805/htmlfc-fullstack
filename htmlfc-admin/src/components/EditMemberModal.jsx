import { Modal, Form, Input, Select, Upload, Button, message } from "antd";
import { useEffect, useState } from "react";
import { uploadImage } from "../services/api";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function EditMemberModal({ open, onCancel, onOk, initialValues }) {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (open) {
      form.setFieldsValue(initialValues);
      setPreviewUrl(initialValues?.avatar ?? null); // 🟢 Hiện ảnh nếu đã có
    }
  }, [open, initialValues, form]);

  const handleSubmit = () => {
    form.validateFields()
      .then((values) => {
        onOk(values);
        form.resetFields();
        setPreviewUrl(null);
      });
  };

  const handleCustomUpload = async ({ file, onSuccess, onError }) => {
    try {
      setUploading(true);
      const response = await uploadImage("avatar-member", file); // res = "/avatar-member/xyz.jpg"
      const fullUrl = `http://35.247.156.29:8080${response}`;
      form.setFieldsValue({ avatar: fullUrl });
      setPreviewUrl(fullUrl); // 🟢 Cập nhật ảnh preview
      message.success("Tải ảnh lên thành công");
      onSuccess();
    } catch (err) {
      message.error("Tải ảnh thất bại");
      onError(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      title="Chỉnh sửa thành viên"
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Lưu"
      cancelText="Hủy"
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        <Form.Item name="firstName" label="Họ" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="middleName" label="Tên đệm">
          <Input />
        </Form.Item>
        <Form.Item name="lastName" label="Tên" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Số điện thoại">
          <Input />
        </Form.Item>
        <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
          <Select>
            <Option value="Admin">Admin</Option>
            <Option value="User">User</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Ảnh đại diện">
          <Upload
            name="file"
            showUploadList={false}
            customRequest={handleCustomUpload}
          >
            <Button icon={<UploadOutlined />} loading={uploading}>
              Tải ảnh lên
            </Button>
          </Upload>

          {/* 🖼️ Ảnh Preview */}
          {previewUrl && (
            <div style={{ marginTop: 10, textAlign: "center" }}>
              <img
                src={previewUrl}
                alt="preview"
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "1px solid #ccc"
                }}
              />
            </div>
          )}
        </Form.Item>

        {/* Hidden field để submit avatar URL */}
        <Form.Item name="avatar" noStyle>
          <Input type="hidden" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
