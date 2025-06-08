import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }) {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const token = localStorage.getItem("accessToken"); // ✅ sửa lại ở đây

  if (!isLoggedIn && !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}