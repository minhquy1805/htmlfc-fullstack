import { Modal, Form, Input, Button, message } from "antd";
import { useEffect, useState } from "react";
import { updateCertificateType } from "../services/api";

export default function EditCertificateTypeModal({ open, onCancel, onOk, initialValues }){
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(open && initialValues) {
            form.setFieldsValue({
                ...initialValues
            });
        }
    }, [open, initialValues, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const payload = { ...initialValues, ...values };

            setLoading(true);
            await updateCertificateType(payload);
            message.success("Cập nhật chứng chỉ thành công!");
            onOk(); // Callback để reload lại danh sách
            form.resetFields();
        } catch (err) {
            message.error("Lỗi khi cập nhật!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Chỉnh sửa loại chứng chỉ"
            open={open}
            onCancel={onCancel}
            onOk={handleSubmit}
            okText="Lưu"
            cancelText="Hủy"
            confirmLoading={loading}
            destroyOnClose
        >
            <Form layout="vertical" form={form}>
                <Form.Item
                    label="Tên loại chứng chỉ"
                    name="certificateTitle"
                    rules={[{ required: true, message: "Không được bỏ trống tên loại" }]}
                    >
                        <Input placeholder="Nhập tên loại chứng chỉ" />
                </Form.Item>
            </Form>
        </Modal>
    )
}