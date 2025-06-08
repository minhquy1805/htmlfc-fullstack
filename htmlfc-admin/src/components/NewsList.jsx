import { useEffect, useState } from "react"; 
import { Table, Typography, message, Image, Space, Button, Tooltip } from "antd";
import moment from "moment";
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined  } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "antd";
import { getNews, updateNews, deleteNews } from "../services/api";
import EditNewsModal from "./EditNewsModal";
import Swal from "sweetalert2";

const { Title } = Typography;

export default function NewsList() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 👈 để chuyển trang

  const [editingNews, setEditingNews] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getNews();
        setNewsList(data);
      } catch (err) {
        message.error("Không thể lấy danh sách bài báo.");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "newsId",
      key: "newsId",
      width: 80,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: 200,
    },
    {
      title: "Tóm tắt",
      dataIndex: "lead",
      key: "lead",
      width: 300, // 👈 tăng chiều rộng cho cột này
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (createdAt) =>
        createdAt ? moment(createdAt).format("DD/MM/YYYY") : "",
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      width: 120,
      render: (img) =>
        img ? (
          <Image
            src={img}
            width={80}
            height={50}
            style={{ objectFit: "cover", borderRadius: 8 }}
          />
        ) : (
          "—"
        ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120, // 👈 thu nhỏ lại cột hành động
      render: (_, record) => {
        return (
           <Space>
            <Tooltip title="Chi tiết">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => navigate(`/news/${record.newsId}`)}
              />
            </Tooltip>
            <Tooltip title="Sửa">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
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
        )
      }
       
    },
  ];

  const handleEdit = (news) => {
    setEditingNews(news);
    setIsModalOpen(true);
  }

  const handleUpdateSubmit = async (values) => {
    const updatedNews = {
      ...editingNews,
      ...values
    };

    console.log("🔁 Gửi dữ liệu update:", updatedNews);

    try {
      await updateNews(updatedNews);
      // ✅ Hiển thị SweetAlert khi update thành công
      await Swal.fire({
        icon: "success",
        title: "Cập nhật thành công!",
        text: `${updatedNews.title} đã được cập nhật.`,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });

      const refreshedList = await getNews();
      setNewsList(refreshedList);
      setIsModalOpen(false);
    } catch (err) {
      // ❌ Hiển thị lỗi bằng SweetAlert
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể cập nhật bài báo.",
      });
    }
  };

  const handleDelete = async (news) => {
    const title = `${news.title}`.trim();

    const result = await Swal.fire({
        title: `Xác nhận xóa`,
        text: `Bạn có chắc muốn xóa ${title}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy bỏ",
      });

    if (result.isConfirmed) {
        try {
          await deleteNews(news.newsId);

          await Swal.fire({
              icon: "success",
              title: "Đã xóa!",
              text: `${title} đã được xóa.`,
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true,
            });

            const refreshed = await getNews();
            setNewsList(refreshed);
        } catch (err) {
            Swal.fire({
              icon: "error",
              title: "Lỗi",
              text: "Không thể xóa bài báo.",
            });
        }
    }
  };

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>Danh sách bài báo</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/news/insert")} // 👉 điều hướng tới trang thêm bài báo
          >
            Thêm bài báo
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={newsList}
        rowKey="newsId"
        loading={loading}
        bordered
        scroll={{ x: "max-content" }}
      />

      <EditNewsModal open={isModalOpen} initialValues={editingNews} onCancel={() => setIsModalOpen(false)} onOk={handleUpdateSubmit}/>

    </div>
  );
}
