import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getNewsById } from "../services/api";
import { Descriptions, Skeleton, Typography, Image, Tag } from "antd";

const { Title } = Typography;

export default function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getNewsById(id);
        setNews(data);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) return <Skeleton active />;
  if (!news) return <p>Không tìm thấy bài báo.</p>;

  return (
    <div>
      <Title level={3}>Chi tiết bài báo</Title>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Tiêu đề">{news.title}</Descriptions.Item>
        <Descriptions.Item label="Tóm tắt">{news.lead}</Descriptions.Item>
        <Descriptions.Item label="Nội dung">{news.contentNew}</Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {news.createdAt && new Date(news.createdAt).toLocaleDateString()}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={news.flag === "s" ? "green" : "red"}>
            {news.flag === "s" ? "Hiển thị" : "Bị ẩn"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Ảnh">
          {news.image ? (
            <Image
              src={news.image}
              width={200}
              style={{ objectFit: "cover", borderRadius: 8 }}
            />
          ) : (
            "Không có ảnh"
          )}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}