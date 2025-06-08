import { Menu } from "antd";
import {
  DashboardOutlined,
  // TeamOutlined,
  // SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  FileTextOutlined, // 👉 icon cho mục Tin tức
  CalendarOutlined,
  SafetyCertificateOutlined ,
  IdcardOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useCallback } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("refreshToken");
    dispatch(logout());
    navigate("/login");
  }, [dispatch, navigate]);

  const items = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/"),
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: "Người dùng",
      // children: [
      //   {
      //     key: "members",
      //     icon: <TeamOutlined />,
      //     label: "Thành viên",
      //     onClick: () => navigate("/members"),
      //   },
        
      // ],
      onClick: () => navigate("/members"),
    },
    {
      key: "news",
      icon: <FileTextOutlined />,
      label: "Tin tức",
      onClick: () => navigate("/news"), // 👉 đường dẫn tới trang News.jsx
    },
    {
      key: "calendar",
      icon: <CalendarOutlined />,
      label: "Lịch đá bóng",
      onClick: () => navigate("/calendar"),
    },
    {
      key: "certificate-type",
      icon: <SafetyCertificateOutlined />,
      label: "Loại chứng chỉ",
      onClick: () => navigate("/certificate-type"),
    },
    {
      key: "certificate",
      icon: < IdcardOutlined/>,
      label: "Chứng chỉ",
      path: "/certificate",
    },
    
    // {
    //   key: "settings",
    //   icon: <SettingOutlined />,
    //   label: "Cài đặt",
    //   onClick: () => navigate("/settings"),
    // },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

   return (
    <>
      <div
        className="demo-logo-vertical"
        style={{ height: 32, margin: 16, background: "rgba(255,255,255,0.3)" }}
      />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["dashboard"]}
        items={items}
      />
    </>
  );
}
