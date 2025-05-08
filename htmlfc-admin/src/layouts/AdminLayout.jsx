import { Layout } from "antd";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const { Header, Sider, Content, Footer } = Layout;

export default function AdminLayout() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={220}>
        <Sidebar /> {/* 👉 Sidebar nằm ở đây */}
      </Sider>
      <Layout>
        <Navbar /> {/* ✅ thay thế phần Header cũ */}
        <Content style={{ margin: 16 }}>
          <Outlet /> {/* Hiển thị các trang con */}
        </Content>
        <Footer style={{ textAlign: "center" }}>
          © {new Date().getFullYear()} HTMLFC Admin
        </Footer>
      </Layout>
    </Layout>
  );
}
