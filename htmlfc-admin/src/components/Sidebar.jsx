// src/components/Sidebar.jsx
import { Menu } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";

export default function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Menu theme="dark" mode="inline" defaultSelectedKeys={["dashboard"]}>
      <Menu.Item key="dashboard" icon={<DashboardOutlined />} onClick={() => navigate("/")}>
        Dashboard
      </Menu.Item>
      <Menu.SubMenu key="users" icon={<UserOutlined />} title="Người dùng">
        <Menu.Item key="members" icon={<TeamOutlined />} onClick={() => navigate("/members")}>
          Thành viên
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key="settings" icon={<SettingOutlined />} onClick={() => navigate("/settings")}>
        Cài đặt
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );
}
