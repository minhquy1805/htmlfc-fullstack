import { useEffect, useState } from "react";
import {
  Table,
  Typography,
  message,
  Space,
  Button,
  Tooltip,
  Row,
  Col,
} from "antd";
import {
  getCalendar,
  deleteCalendar,
} from "../services/api";
import moment from "moment";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import EditCalendarModal from "./EditCalendarModal";
import Swal from "sweetalert2";

const { Title } = Typography;

export default function CalendarList() {
  const [calendarList, setCalendarList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCalendar, setEditingCalendar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchCalendar = async () => {
    try {
      const data = await getCalendar();
      setCalendarList(data);
    } catch (err) {
      message.error("Không thể lấy danh sách lịch đá bóng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, []);

  const handleDelete = async (calendar) => {
    const calendarTitle = calendar.title?.trim() || "lịch";

    const result = await Swal.fire({
      title: `Xác nhận xóa`,
      text: `Bạn có chắc muốn xóa "${calendarTitle}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await deleteCalendar(calendar.calendarId);
        await Swal.fire({
          icon: "success",
          title: "Đã xóa!",
          text: `"${calendarTitle}" đã được xóa.`,
          timer: 1500,
          showConfirmButton: false,
        });
        fetchCalendar();
      } catch (err) {
        Swal.fire("Lỗi", "Không thể xóa lịch đá bóng.", "error");
      }
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "calendarId",
      key: "calendarId",
      width: 80,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Sự kiện",
      dataIndex: "event",
      key: "event",
    },
    {
      title: "Thời gian",
      dataIndex: "calendarTime",
      key: "calendarTime",
      render: (time) =>
        time ? moment(time).format("DD/MM/YYYY HH:mm") : "",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        date ? moment(date).format("DD/MM/YYYY") : "",
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/calendar/${record.calendarId}`)}
            />
          </Tooltip>
          <Tooltip title="Sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingCalendar(record);
                setIsModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: 16 }}
      >
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            Danh sách lịch đá bóng
          </Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/calendar/insert")}
          >
            Thêm lịch đá bóng
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={calendarList}
        rowKey="calendarId"
        loading={loading}
        bordered
        scroll={{ x: "max-content" }}
      />

      <EditCalendarModal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingCalendar(null);
        }}
        onOk={async () => {
          try {
            await fetchCalendar();
            Swal.fire({
              icon: "success",
              title: "Cập nhật thành công!",
              showConfirmButton: false,
              timer: 1500,
            });
            setIsModalOpen(false);
            setEditingCalendar(null);
          } catch (err) {
            Swal.fire("Lỗi", "Cập nhật thất bại!", "error");
          }
        }}
        initialValues={editingCalendar}
      />
    </div>
  );
}
