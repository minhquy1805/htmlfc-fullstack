import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Typography, message } from "antd";
import { getVerifiedUsers } from "../services/api"; // Giả sử bạn có API này

const { Title } = Typography;

export default function UserVerificationChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getVerifiedUsers(); // Trả về danh sách user đã xác thực

        // Nhóm theo tháng
        const countsByMonth = {};
        users.forEach((user) => {
          const date = new Date(user.createdAt);
          const month = `${date.getMonth() + 1}/${date.getFullYear()}`; // VD: "5/2025"
          countsByMonth[month] = (countsByMonth[month] || 0) + 1;
        });

        const dataFormatted = Object.keys(countsByMonth).map((month) => ({
          month,
          count: countsByMonth[month],
        }));

        setChartData(dataFormatted);
      } catch (err) {
        message.error("Lỗi khi lấy dữ liệu xác thực người dùng.");
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <Title level={4}>Số người dùng đã xác thực theo tháng</Title>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 16, right: 30, left: 0, bottom: 16 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#1890ff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
