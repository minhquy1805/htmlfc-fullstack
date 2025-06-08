import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getCalendar } from "../services/api";
import { Modal, Typography, message } from "antd";
import moment from "moment";
import './css/MatchCalendarPro.css';

const { Title } = Typography;

export default function MatchCalendarPro() {
  const [calendarList, setCalendarList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const data = await getCalendar();
        setCalendarList(data);
      } catch (err) {
        message.error("Không thể lấy lịch bóng đá.");
      } finally {
        setLoading(false);
      }
    };
    fetchCalendar();
  }, []);

  const handleEventClick = (clickInfo) => {
    const { title, extendedProps, start } = clickInfo.event;
    setSelectedEvent({
      title,
      detail: extendedProps.description || "Không có mô tả",
      time: moment(start).format("HH:mm DD/MM/YYYY"),
    });
    setIsModalOpen(true);
  };

  const events = calendarList.map((item) => ({
    title: item.title,
    start: item.calendarTime,
    extendedProps: {
      description: item.event,
    },
  }));

  return (
    <div>
      <Title level={3}>Lịch thi đấu</Title>
      <div className="calendar-wrapper">
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={handleEventClick}
            height={600}
            locale="vi"
            buttonText={{
            today: "Hôm nay",
            month: "Tháng",
            week: "Tuần",
            day: "Ngày",
            list: "Danh sách",
            }}
        />
      </div>
      

      <Modal
        title="Chi tiết sự kiện"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        {selectedEvent && (
          <div>
            <p><strong>Tên:</strong> {selectedEvent.title}</p>
            <p><strong>Chi tiết:</strong> {selectedEvent.detail}</p>
            <p><strong>Thời gian:</strong> {selectedEvent.time}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
