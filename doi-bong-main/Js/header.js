document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    // Lấy phần tử login, logout, và account
    const loginLink = document.getElementById("login-link");
    const logoutLink = document.getElementById("logout-link");
    const accountLink = document.getElementById("account-link");
    const profileLink = document.getElementById("profile-link");

    if (token) {
        // Nếu đã đăng nhập, ẩn login, hiển thị logout
        if (loginLink) loginLink.classList.add("hidden");
        if (logoutLink) logoutLink.classList.remove("hidden");

        
    } else {
        // Nếu chưa đăng nhập, ẩn logout, hiển thị login
        if (loginLink) loginLink.classList.remove("hidden");
        if (logoutLink) logoutLink.classList.add("hidden");

        // Khi bấm vào "Login", chuyển hướng đến login-signup.html
        if (loginLink) {
            loginLink.addEventListener("click", function (event) {
                event.preventDefault();
                window.location.href = "login-signup.html";
            });
        };
    }

    // Xử lý khi bấm "Logout"
    if (logoutLink) {
        logoutLink.addEventListener("click", function () {
            localStorage.clear(); // Xóa toàn bộ localStorage
            location.reload(); // Reload lại trang để cập nhật trạng thái
        });
    }
});

// Hàm kiểm tra quyền từ token
document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    if (token) {
        try {
            // Giải mã token
            const decodedToken = jwt_decode(token);
            const role = decodedToken.role;
            const memberId = decodedToken.nameid;
            const username = decodedToken.unique_name; // Lấy username từ token

            // Lưu thông tin vào localStorage nếu chưa có
            if (memberId) localStorage.setItem("MemberId", memberId);
            if (role) localStorage.setItem("role", role);
            if (username) localStorage.setItem("username", username);

            // Kiểm tra quyền
            if (role === "admin") {
                console.log("Đăng nhập với quyền Admin.");
            } else {
                console.log("Đăng nhập với quyền User.");
            }
        } catch (error) {
            console.error("Lỗi giải mã token:", error);
            alert("Token không hợp lệ.");
        }
    } else {
        console.log("Chưa đăng nhập.");
    }
});

// Hàm cập nhật tên người dùng trên "Your Account"
function updateUserLinks() {
    const username = localStorage.getItem("username");
    const accountLink = document.getElementById("account-link");
    const profileLink = document.getElementById("profile-link");

    if (accountLink) {
        accountLink.textContent = username ? username.toUpperCase() : "YOUR ACCOUNT";
        accountLink.href = username ? "profile.html" : "login-signup.html";
    }

    if (profileLink) {
        profileLink.textContent = username ? username.toUpperCase() : "TRANG CÁ NHÂN";
        profileLink.href = username ? "profile.html" : "login-signup.html"; // Nếu chưa đăng nhập, không cho bấm
    }
}

// Gọi khi trang tải
document.addEventListener("DOMContentLoaded", updateUserLinks);



