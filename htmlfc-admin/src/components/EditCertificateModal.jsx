import { Modal, Form, Input, Button, DatePicker, Select, message } from "antd";
import { useEffect, useState } from "react";
import { getCertificateTypes, updateCertificate } from "../services/api";
import dayjs from "dayjs";
import Swal from "sweetalert2";

const { Option } = Select;

export default function EditCertificateModal({ open, onCancel, onOk, initialValues }) {
  const [form] = Form.useForm();
  const [certificateTypes, setCertificateTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        dateCert: dayjs(initialValues.dateCert),
        certificateTypeId: initialValues.certificateType?.certificateTypeId
      });
    }
  }, [open, initialValues, form]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await getCertificateTypes();
        setCertificateTypes(types);
      } catch {
        message.error("Không thể tải loại chứng chỉ");
      }
    };
    fetchTypes();
  }, []);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...initialValues,
        ...values,
        dateCert: values.dateCert.toISOString(),
        certificateTypeId: values.certificateTypeId,
        field1: "string",
        field2: "string",
        field3: "string",
        field4: "string",
        field5: "string",
        flag: "s"
      };
      setLoading(true);
      await updateCertificate(payload);

      await Swal.fire({
        icon: "success",
        title: "Cập nhật thành công!",
        showConfirmButton: false,
        timer: 1500
      });

      onOk(); // callback để reload danh sách
      form.resetFields();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Cập nhật thất bại. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Chỉnh sửa chứng chỉ"
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
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: "Không được bỏ trống tiêu đề" }]}
        >
          <Input placeholder="Nhập tiêu đề chứng chỉ" />
        </Form.Item>

        <Form.Item
          name="certificateTypeId"
          label="Loại chứng chỉ"
          rules={[{ required: true, message: "Chọn loại chứng chỉ" }]}
        >
          <Select placeholder="Chọn loại">
            {certificateTypes.map((type) => (
              <Option key={type.certificateTypeId} value={type.certificateTypeId}>
                {type.certificateTitle}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="contentCert" label="Nội dung">
          <Input.TextArea rows={3} placeholder="Nhập nội dung" />
        </Form.Item>

        <Form.Item
          name="dateCert"
          label="Ngày cấp"
          rules={[{ required: true, message: "Chọn ngày cấp" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="signCert" label="Người ký">
          <Input placeholder="Nhập tên người ký" />
        </Form.Item>

        <Form.Item name="reasonCert" label="Lý do">
          <Input placeholder="Nhập lý do cấp" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
