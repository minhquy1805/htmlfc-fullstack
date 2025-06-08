import { useEffect, useState } from "react";
import { getNews } from "../services/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import moment from "moment";
import { Typography, message } from "antd";

const { Title } = Typography;

export default function NewsStats() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const news = await getNews();

        const counts = news.reduce((acc, item) => {
          const date = moment(item.createdAt).format("DD/MM");
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        const formatted = Object.entries(counts).map(([date, count]) => ({
          date,
          count,
        }));

        setChartData(formatted);
      } catch (err) {
        message.error("Không thể tải dữ liệu bài báo");
      }
    };

    fetchNews();
  }, []);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <Title level={4}>Thống kê số lượng bài báo theo ngày</Title>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#1890ff" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}