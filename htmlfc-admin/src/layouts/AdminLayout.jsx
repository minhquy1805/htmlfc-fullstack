import { Layout, Menu, Breadcrumb, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const { Header, Content, Footer, Sider } = Layout;




export default function AdminLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  // ⏬ trong component AdminLayout
  const location = useLocation();

  const breadcrumbMap = {
    "/": "Trang chủ",
    "/members": "Thành viên",
    "/settings": "Cài đặt",
    "/news": "Tin tức",
    "/calendar": "Lịch bóng đá",

    // 🆕 Bổ sung thêm các đường dẫn mới:
    "/members/:id": "Chi tiết thành viên",
    "/news/:newsId": "Chi tiết tin tức",
    "/calendar/:calendarId": "Chi tiết lịch đá bóng",
    "/calendar/insert": "Thêm lịch",
    "/news/insert": "Thêm bài báo",
  };

  const currentPath = location.pathname;
  const currentBreadcrumb = breadcrumbMap[currentPath] || "Chi tiết";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        {/* <div className="demo-logo-vertical" style={{ height: 32, margin: 16, background: "rgba(255,255,255,0.3)" }} />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["dashboard"]} items={menuItems} /> */}
        <Sidebar />
      </Sider>

      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Trang</Breadcrumb.Item>
            <Breadcrumb.Item>{currentBreadcrumb}</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          HTMLFC Admin ©{new Date().getFullYear()} Created by Minh Quy Pro 🚀
        </Footer>
      </Layout>
    </Layout>
  );
}
