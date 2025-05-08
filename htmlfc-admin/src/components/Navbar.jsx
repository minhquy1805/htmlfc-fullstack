import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Layout, Menu, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";

const { Header } = Layout;
const { Title } = Typography;

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    dispatch(logout());
    navigate("/login");
  };

  const items = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#001529", // màu mặc định của Ant Design
        padding: "0 24px",
      }}
    >
      {/* Tên app bên trái */}
      <Title level={3} style={{ color: "#fff", margin: 0 }}>
        HTML_FC
      </Title>

      {/* Dropdown user bên phải */}
      <Dropdown menu={{ items }}>
        <span style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", color: "#fff" }}>
          <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
          {user?.username || "Admin"}
        </span>
      </Dropdown>
    </Header>
  );
}
