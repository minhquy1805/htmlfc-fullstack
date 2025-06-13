// check trang thai token
(function redirectIfLoggedIn() {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    try {
        const decoded = jwt_decode(accessToken);
        const now = Date.now() / 1000;
        if (decoded.exp && decoded.exp > now) {
            const role = decoded.role;
            if (role === "admin") {
                window.location.href = "/admin.html";
            } else {
                window.location.href = "/index.html";
            }
        }
    } catch (e) {
        console.warn("Token không hợp lệ hoặc không giải mã được.");
    }
})();

// dang xuat

function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("MemberId");
    localStorage.removeItem("role");
    window.location.href = "/login.html";
}

//  refresh token

async function refreshAccessToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
        console.warn("Không tìm thấy refreshToken.");
        logout();
        return null;
    }

    try {
        const res = await fetch("http://35.247.156.29:8080/api/v1/refresh-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });

        const text = await res.text();
        let data = {};
        try {
            data = JSON.parse(text);
        } catch (e) {
            throw new Error("Không thể parse phản hồi refresh token.");
        }

        if (!res.ok) {
            throw new Error(data.message || text || "Làm mới token thất bại.");
        }

        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;

        if (!newAccessToken || !newRefreshToken) {
            throw new Error("Phản hồi làm mới token thiếu dữ liệu.");
        }

        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        console.log("✅ AccessToken đã được làm mới.");
        return newAccessToken;

    } catch (error) {
        console.error("❌ Lỗi làm mới accessToken:", error.message);
        logout();
        return null;
    }
}

async function authFetch(url, options = {}) {
    let token = localStorage.getItem("accessToken");

    if (!options.headers) options.headers = {};
    options.headers["Authorization"] = `Bearer ${token}`;

    let response = await fetch(url, options);

    if (response.status === 401) {
        console.warn("⚠️ Token hết hạn, đang làm mới...");
        token = await refreshAccessToken();

        if (!token) return response;

        options.headers["Authorization"] = `Bearer ${token}`;
        response = await fetch(url, options);
    }

    return response;
}

window.authUtils = {
    authFetch,
    refreshAccessToken,
    logout
};