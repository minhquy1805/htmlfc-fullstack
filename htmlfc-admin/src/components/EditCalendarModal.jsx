import { Modal, Form, Input, DatePicker, Button, message } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { updateCalendar } from "../services/api";

export default function EditCalendarModal({ open, onCancel, onOk, initialValues }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        calendarTime: dayjs(initialValues.calendarTime),
      });
    }
  }, [open, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...initialValues,
        ...values,
        calendarTime: values.calendarTime.toISOString(),
        createdAt: new Date().toISOString(),
        field1: "string",
        field2: "string",
        field3: "string",
        field4: "string",
        field5: "string",
        flag: "s",
      };

      setLoading(true);
      await updateCalendar(payload);
      message.success("Cập nhật lịch thành công!");
      onOk(); // Callback để reload lại danh sách
      form.resetFields();
    } catch (err) {
      message.error("Lỗi khi cập nhật lịch!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Chỉnh sửa lịch bóng đá"
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={loading}
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="event" label="Sự kiện" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="calendarTime" label="Thời gian" rules={[{ required: true }]}>
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
