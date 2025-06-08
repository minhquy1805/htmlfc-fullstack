import { useEffect, useState } from "react";
import { Table, Typography, message, Tag, Space, Button, Tooltip } from "antd";
import { getMembers } from "../services/api";
import moment from "moment";
import EditMemberModal from "./EditMemberModal";
import { updateMember } from "../services/api";
import { deleteMember } from "../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";


const { Title } = Typography;

export default function MemberList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingMember, setEditingMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

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
      width: 80,
    },

    {
      title: "Ảnh đại diện",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) =>
        avatar ? (
          <img
            src={`${avatar}`}
            alt="avatar"
            style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", display: "block", margin: "0 auto" }}
          />
        ) : (
          "—"
        ),
    },
    {
      title: "Tên đầy đủ",
      key: "fullName",
      render: (_, record) =>
        `${record.firstName ?? ""} ${record.middleName ?? ""} ${record.lastName ?? ""}`.trim(),
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
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "Admin" ? "volcano" : "blue"}>
          {role}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) =>
        createdAt ? moment(createdAt).format("DD/MM/YYYY") : "",
    },
    {
      title: "Trạng thái",
      dataIndex: "flag",
      key: "flag",
      render: (flag) =>
        flag === "T" ? (
          <Tag color="green">✔️ Đã xác thực</Tag>
        ) : (
          <Tag color="red">❌ Chưa xác thực</Tag>
        ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => {
        // const fullName = `${record.firstName ?? ""} ${record.middleName ?? ""} ${record.lastName ?? ""}`.trim();

        return (
          <Space>
            <Tooltip title="Chi tiết">
              <Button
                type="link"
                icon={<EyeOutlined />}
                onClick={() => navigate(`/members/${record.memberId}`)}
              />
            </Tooltip>

            <Tooltip title="Sửa">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              />
            </Tooltip>

            <Tooltip title="Xóa">
              <Button
                type="link"
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleDelete(record)}
              />
            </Tooltip>
          </Space>
        );
      }
    }
  ];

  const handleEdit = (member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleUpdateSubmit = async (values) => {
    const updatedMember = {
      ...editingMember,
      ...values
    };

    console.log("🔁 Gửi dữ liệu update:", updatedMember);

    try {
      await updateMember(updatedMember);

      // ✅ Hiển thị SweetAlert khi update thành công
      await Swal.fire({
        icon: "success",
        title: "Cập nhật thành công!",
        text: `${updatedMember.firstName} đã được cập nhật.`,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });

      const refreshedList = await getMembers();
      setMembers(refreshedList);
      setIsModalOpen(false);
    } catch (err) {
      // ❌ Hiển thị lỗi bằng SweetAlert
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể cập nhật thành viên.",
      });
    }
  };

 const handleDelete = async (member) => {
  const fullName = `${member.firstName ?? ""} ${member.middleName ?? ""} ${member.lastName ?? ""}`.trim();

  const result = await Swal.fire({
    title: `Xác nhận xóa`,
    text: `Bạn có chắc muốn xóa ${fullName}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy bỏ",
  });

  if (result.isConfirmed) {
    try {
      await deleteMember(member.memberId);

      await Swal.fire({
        icon: "success",
        title: "Đã xóa!",
        text: `${fullName} đã được xóa.`,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });

      const refreshed = await getMembers();
      setMembers(refreshed);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể xóa thành viên.",
        });
      }
    }
  };

  return (
    <div>
      <Title level={3}>Danh sách thành viên</Title>
      <Table
        columns={columns}
        dataSource={members}
        rowKey="memberId"
        loading={loading}
        bordered
        scroll={{ x: "max-content" }} // 👈 tự động scroll ngang nếu cần
      />

      {/* 👇 Modal chỉnh sửa */}
    <EditMemberModal
      open={isModalOpen}
      initialValues={editingMember}
      onCancel={() => setIsModalOpen(false)}
      onOk={handleUpdateSubmit}
    />
    </div>
  );
}
