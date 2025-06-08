import { useEffect, useState } from "react";
import { Card, Typography, Descriptions, Spin, message } from "antd";
import { useParams } from "react-router-dom";
import { getCalendarById } from "../services/api";
import moment from "moment";

const { Title } = Typography;

export default function CalendarDetail() {
  const { calendarId } = useParams();
  const [calendar, setCalendar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const data = await getCalendarById(calendarId);
        setCalendar(data);
      } catch (err) {
        message.error("Không thể tải dữ liệu lịch bóng đá.");
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
  }, [calendarId]);

  if (loading) return <Spin tip="Đang tải..." />;

  if (!calendar) return <p>Không tìm thấy lịch bóng đá.</p>;

  return (
    <div>
      <Card>
        <Title level={3}>Chi tiết lịch bóng đá</Title>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Tiêu đề">{calendar.title}</Descriptions.Item>
          <Descriptions.Item label="Sự kiện">{calendar.event}</Descriptions.Item>
          <Descriptions.Item label="Thời gian">
            {moment(calendar.calendarTime).format("DD/MM/YYYY HH:mm")}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {moment(calendar.createdAt).format("DD/MM/YYYY")}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
