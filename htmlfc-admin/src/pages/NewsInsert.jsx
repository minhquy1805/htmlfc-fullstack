import { useState } from "react";
import { Form, Input, Button, Upload, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { uploadImage, insertNews } from "../services/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const { Title } = Typography;

export default function NewsInsert() {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      newsId: 0,
      createdAt: new Date().toISOString(),
      field1: "string",
      field2: "string",
      field3: "string",
      field4: "string",
      field5: "string",
      flag: "s",
    };

    try {
      await insertNews(payload);

      await Swal.fire({
        icon: "success",
        title: "🎉 Đã thêm bài báo!",
        text: "Bài báo đã được tạo thành công.",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });

      navigate("/news");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể thêm bài báo.",
      });
    }
  };

  const handleCustomUpload = async ({ file, onSuccess, onError }) => {
    try {
      setUploading(true);
      const response = await uploadImage("news-image", file);
      const fullUrl = `http://35.247.156.29:8080${response}`;
      form.setFieldsValue({ image: fullUrl });
      setPreviewUrl(fullUrl);
      onSuccess();
    } catch (err) {
      onError(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <Title level={3}>📝 Thêm bài báo mới</Title>

      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="lead" label="Tóm tắt" rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item name="contentNew" label="Nội dung" rules={[{ required: true }]}>
          <Input.TextArea rows={6} />
        </Form.Item>

        <Form.Item label="Ảnh minh họa">
          <Upload
            name="file"
            showUploadList={false}
            customRequest={handleCustomUpload}
          >
            <Button icon={<UploadOutlined />} loading={uploading}>
              Tải ảnh lên
            </Button>
          </Upload>

          {previewUrl && (
            <img
              src={previewUrl}
              alt="preview"
              style={{
                marginTop: 12,
                maxWidth: "100%",
                height: "auto",
                borderRadius: 8,
                border: "1px solid #ddd"
              }}
            />
          )}
        </Form.Item>

        <Form.Item name="image" noStyle>
          <Input type="hidden" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Thêm bài báo
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
