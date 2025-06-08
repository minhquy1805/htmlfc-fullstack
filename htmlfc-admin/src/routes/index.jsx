import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import RequireAuth from "./RequireAuth";
import Dashboard from "../pages/Dashboard"; // bạn phải tạo Dashboard.jsx (simple)
import LoginLayout from "../layouts/LoginLayout";
import Loginpage from "../pages/LoginPage";
import Member from "../pages/Member";
import MemberDetail from "../pages/MemberDetail";
import News from "../pages/News";
import NewsInsert from "../pages/NewsInsert";
import NewsDetail from "../pages/NewsDetail";
import Calendar from "../pages/Calendar";
import CalendarInsert from "../pages/CalendarInsert";
import CalendarDetail from "../pages/CalendarDetail";
import CertificateType from "../pages/CertificateType";
import CertificateTypeDetail from "../pages/CertificateTypeDetail";
import CertificateTypeInsert from "../pages/CertificateTypeInsert";
import Certificate from "../pages/Certificate";
import CertificateInsert from "../pages/CertificateInsert";
import CertificateDetail from "../pages/CertificateDetail";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <LoginLayout />
    ),
    children: [
      { index: true, element: <Loginpage /> }
    ]
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "members", element: <Member /> }, // <<< thêm dòng này
      { path: "members/:id", element: <MemberDetail /> },
      { path: "news", element: <News /> },
      { path: "news/insert", element: <NewsInsert />},
      { path: "news/:id", element: <NewsDetail /> },
      { path: "calendar", element: <Calendar />},
      { path: "calendar/insert", element: <CalendarInsert /> },
      { path: "calendar/:calendarId", element: <CalendarDetail /> },
      { path: "certificate-type", element: <CertificateType />},
      { path: "certificate-type/:id", element: <CertificateTypeDetail />},
      { path: "certificate-type/insert", element: <CertificateTypeInsert />},
      { path: "certificate", element: <Certificate />},
      { path: "certificate/:certificateId", element: <CertificateDetail />},
      { path: "certificate/insert", element: <CertificateInsert />},
    ],
  },
]);

export default router;
