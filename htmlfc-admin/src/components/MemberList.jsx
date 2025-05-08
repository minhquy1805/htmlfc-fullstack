// src/pages/MemberList.jsx
import { useEffect, useState } from "react";
import { Table, Typography, message } from "antd";
import { getMembers } from "../services/api";

const { Title } = Typography;

export default function MemberList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getMembers();
        setMembers(data);
      } catch (err) {
        message.error("Không thể lấy danh sách thành viên.");
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "memberId",
      key: "memberId",
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
    },
  ];

  return (
    <div>
      <Title level={3}>Danh sách thành viên</Title>
      <Table
        columns={columns}
        dataSource={members}
        rowKey="memberId"
        loading={loading}
        bordered
      />
    </div>
  );
}
