import { Modal, Form, Input, Upload, Button, message } from "antd";
import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { uploadImage } from "../services/api";


export default function EditNewsModal({ open, onCancel, onOk, initialValues }) {
    const [form] = Form.useForm();
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");

    useEffect(() => {
        if (open) {
        form.setFieldsValue(initialValues);
        setPreviewUrl(initialValues?.image ?? null); // 🟢 Hiện ảnh nếu đã có
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
            const response = await uploadImage("news-image", file);
            const fullUrl = `http://35.247.156.29:8080${response}`;
            form.setFieldsValue({ image: fullUrl});
            setPreviewUrl(fullUrl);
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
        <Modal title="Chỉnh sửa bài báo" open={open} onCancel={onCancel} onOk={handleSubmit} okText="Lưu" cancelText="Hủy" destroyOnClose>
            <Form layout="vertical" form={form}>
                <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="lead" label="Tóm tắt">
                    <Input />
                </Form.Item>

                <Form.Item name="contentNew" label="Nội dung">
                    <Input.TextArea rows={5} />
                </Form.Item>

                <Form.Item label="Ảnh bài báo">

                    <Upload name="file" showUploadList={false} customRequest={handleCustomUpload}>
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
                <Form.Item name="image" noStyle>
                    <Input type="hidden" />
                </Form.Item>
            </Form>
        </Modal>
    )
}