import { data } from "react-router-dom";
import axiosClient from "./axiosClient";

export const loginApi = async (username, password, deviceInfo = navigator.userAgent) => {
  const response = await axiosClient.post("/login", {
    username,
    password,
    deviceInfo,
  });
  return response.data; // { accessToken, refreshToken }
}

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken");
  const response = await axiosClient.post("/refresh-token", {refreshToken});
  return response.data;
};

export const getMembers = async () => {
  const response = await axiosClient.get("/MemberApi/selectall");
  return response.data;
}

export const updateMember = async (member) => {
  const response = await axiosClient.post("/MemberApi/update", member); // hoặc .put nếu bạn dùng PUT
  return response.data;
};

export const deleteMember = async (memberId) => {
  const response = await axiosClient.delete("/MemberApi/delete", {
    params: { id: memberId },
  });
  return response.data;
}

export const uploadImage = async (type, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosClient.post(
    `/FileUpload/File/Upload Single Picture?uploadDirectory=${type}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data; // { filePath: "/news-picture/abc.jpg" }
};

export const getMemberById = async (id) => {
  const response = await axiosClient.get(`/MemberApi/selectbyprimarykey?id=${id}`);
  return response.data;
}

export const getVerifiedUsers = async () => {
  const res = await axiosClient.get("/MemberApi/selectall");
  return res.data.filter(user => user.flag === "T"); 
};

export const getNews = async () => {
  const response = await axiosClient.get("/NewsApi/selectall");
  return response.data;
}

export const insertNews = async (newsData) => {
  const response = await axiosClient.post("/NewsApi/insert", {
    ...newsData,
    field1: "string",
    field2: "string",
    field3: "string",
    field4: "string",
    field5: "string",
    flag: "s",
  });
  return response.data;
}

export const updateNews = async (news) => {
  const response = await axiosClient.post("/NewsApi/update", news);
  return response.data;
}

export const getNewsById = async (id) => {
  const response = await axiosClient.get(`/NewsApi/selectbyprimarykey?id=${id}`);
  return response.data;
}

export const deleteNews = async (newsId) => {
  const response = await axiosClient.delete("/NewsApi/delete", {
    params: { id: newsId },
  });
  return response.request;
}

export const getCalendar = async () => {
  const response = await axiosClient.get("/CalendarApi/selectall");
  return response.data;
}

export const insertCalendar = async (calendarData) => {
  const response = await axiosClient.post("/CalendarApi/insert", {
    ...calendarData,
    field1: "string",
    field2: "string",
    field3: "string",
    field4: "string",
    field5: "string",
    flag: "s",
  });
  return response.data;
}

export const updateCalendar = async (calendar) => {
  const response = await axiosClient.post("/CalendarApi/update", calendar);
  return response.data;
}

export const getCalendarById = async (id) => {
  const response = await axiosClient.get(`/CalendarApi/selectbyprimarykey?id=${id}`);
  return response.data;
}

export const deleteCalendar = async (id) => {
  const response = await axiosClient.delete(`/CalendarApi/delete?id=${id}`);
  return response.data;
}

export const getCertificateTypes = async () => {
  const response = await axiosClient.get("/CertificateTypeApi/selectall");
  return response.data;
};

export const insertCertificateType = async (certificateTypeData) => {
  const response = await axiosClient.post("/CertificateTypeApi/insert", certificateTypeData);
  return response.data;
};

export const getCertificateTypeById = async (id) => {
  const response = await axiosClient.get(`/CertificateTypeApi/selectbyprimarykey?id=${id}`);
  return response.data;
};

export const updateCertificateType = async (certificateTypeData) => {
  const response = await axiosClient.post("/CertificateTypeApi/update", certificateTypeData);
  return response.data;
};

export const deleteCertificateType = async (id) => {
  const response = await axiosClient.delete(`/CertificateTypeApi/delete?id=${id}`);
  return response.data;
}

export const getCertificates = async () => {
  const response = await axiosClient.get("/CertificateApi/selectall");
  return response.data;
}

export const insertCertificate = async (certificateData) => {
  const response = await axiosClient.post("/CertificateApi/insert", certificateData);
  return response.data;
};

export const updateCertificate = async (certificateData) => {
  const response = await axiosClient.post("/CertificateApi/update", certificateData);
  return response.data;
};

export const deleteCertificate = async (id) => {
  const response = await axiosClient.delete(`/CertificateApi/delete?id=${id}`);
  return response.data;
};

export const getCertificateById = async (id) => {
  const response = await axiosClient.get(`/CertificateApi/selectbyprimarykey?id=${id}`);
  return response.data;
};

export const getCertificatesByType = async (certificateTypeId) => {
  const response = await axiosClient.get(`/CertificateApi/selectallbycertificateTypeId?certificateTypeId=${certificateTypeId}`);
  return response.data;
};
