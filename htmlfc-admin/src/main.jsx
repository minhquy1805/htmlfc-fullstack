import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import router from "./routes";
import "bootstrap/dist/css/bootstrap.min.css"
import "antd/dist/reset.css";
import { login } from "./redux/slices/authSlice";

// Nếu đã có token → dispatch login từ localStorage
const token = localStorage.getItem("token") || sessionStorage.getItem("token");
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  store.dispatch(login({
    id: payload.MemberId,
    username: payload.Username,
    role: payload.Role,
  }));
}


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </React.StrictMode>
)