import axios from "axios";

const API_BASE = "http://35.247.156.29:8080/api/v1";

export const loginApi = async (username, password) => {
  const response = await axios.post(
    `${API_BASE}/login`,
    {
      username,
      password,
    },
    {
      headers: {
        "Content-Type": "application/json",   // ✅ Gửi JSON
        "Accept": "application/json",          // ✅ Chấp nhận JSON
      },
    }
  );
  return response.data;
};

const getToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

export const getMembers = async () => {
  const token = getToken();
  const response = await axios.get(`${API_BASE}/MemberApi/selectall`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return response.data;
};