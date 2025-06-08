import { useState } from "react";
import { Button, Form, Input, DatePicker, message, Typography } from "antd";
import { insertCalendar } from "../services/api";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

export default function CalendarInsert() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
      const payload = {
        ...values,
        calendarId: 0,
        createdAt: new Date().toISOString(),
        field1: "string",
        field2: "string",
        field3: "string",
        field4: "string",
        field5: "string",
        flag: "s",
      };
    try {
      await insertCalendar(payload);

      await Swal.fire({
        icon: "success",
        title: "Thêm lịch thành công!",
        showConfirmButton: false,
        timer: 1500
      });

      navigate("/calendar");
    } catch (err) {
      message.error("Lỗi khi thêm lịch!");
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Lỗi khi thêm lịch",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <Title level={3}>Thêm lịch bóng đá</Title>
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="event" label="Sự kiện" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="calendarTime" label="Thời gian" rules={[{ required: true }]}>
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Thêm lịch
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
