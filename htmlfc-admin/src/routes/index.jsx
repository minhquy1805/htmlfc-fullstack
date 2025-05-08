import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import RequireAuth from "./RequireAuth";
import Dashboard from "../pages/Dashboard"; // bạn phải tạo Dashboard.jsx (simple)
import LoginLayout from "../layouts/LoginLayout";
import Loginpage from "../pages/LoginPage";
import Member from "../pages/Member";

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
    ],
  },
]);

export default router;
