document.addEventListener("DOMContentLoaded", function () {
    const loginLink = document.getElementById("login-link");
    const logoutLink = document.getElementById("logout-link");
    const accountLink = document.getElementById("account-link");
    const profileLink = document.getElementById("profile-link");

    let isLoggedIn = false;
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken && typeof jwt_decode === "function") {
        try {
            const decoded = jwt_decode(accessToken);
            const now = Date.now() / 1000;

            if (decoded.exp && decoded.exp > now) {
                isLoggedIn = true;

                const role = decoded.role;
                const memberId = decoded.nameid;
                const username = decoded.unique_name;

                if (memberId) localStorage.setItem("MemberId", memberId);
                if (role) localStorage.setItem("role", role);
                if (username) localStorage.setItem("username", username);

                console.log(`✅ Đăng nhập thành công với quyền ${role.toUpperCase()}`);
            } else {
                console.warn("⚠️ Token đã hết hạn.");
                performLogout();
            }
        } catch (err) {
            console.error("❌ Token không hợp lệ:", err);
            performLogout();
        }
    }

    // Cập nhật giao diện login/logout
    if (isLoggedIn) {
        if (loginLink) loginLink.classList.add("hidden");
        if (logoutLink) logoutLink.classList.remove("hidden");
    } else {
        if (loginLink) loginLink.classList.remove("hidden");
        if (logoutLink) logoutLink.classList.add("hidden");
    }

    // Lấy username
    const username = localStorage.getItem("username");

    // Cập nhật account-link (trên header top)
    if (accountLink) {
        accountLink.textContent = username ? username.toUpperCase() : "YOUR ACCOUNT";
        accountLink.href = username ? "profile.html" : "login-signup.html";
    }

    // Cập nhật profile-link (menu bên trái)
    if (profileLink) {
        profileLink.textContent = username ? username.toUpperCase() : "TRANG CÁ NHÂN";
        profileLink.href = username ? "profile.html" : "login-signup.html";
    }

    // Logout xử lý
    if (logoutLink) {
        logoutLink.addEventListener("click", function () {
            performLogout();
        });
    }

    // Nếu click login-link → về trang login
    if (loginLink) {
        loginLink.addEventListener("click", function () {
            window.location.href = "login-signup.html";
        });
    }

    // Hàm logout dùng chung
    function performLogout() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("MemberId");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        window.location.href = "login-signup.html";
    }

    // Xuất hàm để có thể dùng ở nơi khác
    window.authUtils = {
        logout: performLogout
    };
});
