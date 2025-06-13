document.addEventListener("DOMContentLoaded", function () {
    const accessToken = localStorage.getItem("accessToken");

    const loginLink = document.getElementById("login-link");
    const logoutLink = document.getElementById("logout-link");
    const accountLink = document.getElementById("account-link");
    const profileLink = document.getElementById("profile-link");

    let isLoggedIn = false;

    if (accessToken) {
        try {
            const decodedToken = jwt_decode(accessToken);
            const now = Date.now() / 1000;
            if (decodedToken.exp && decodedToken.exp > now) {
                isLoggedIn = true;

                const role = decodedToken.role;
                const memberId = decodedToken.nameid;
                const username = decodedToken.unique_name;

                if (memberId) localStorage.setItem("MemberId", memberId);
                if (role) localStorage.setItem("role", role);
                if (username) localStorage.setItem("username", username);

                if (role === "admin") {
                    console.log("Đăng nhập với quyền Admin.");
                } else {
                    console.log("Đăng nhập với quyền User.");
                }
            } else {
                console.warn("Token đã hết hạn.");
                localStorage.clear();
            }
        } catch (e) {
            console.error("Token không hợp lệ:", e);
            localStorage.clear();
        }
    }

    // Cập nhật trạng thái menu
    if (isLoggedIn) {
        if (loginLink) loginLink.classList.add("hidden");
        if (logoutLink) logoutLink.classList.remove("hidden");
    } else {
        if (loginLink) loginLink.classList.remove("hidden");
        if (logoutLink) logoutLink.classList.add("hidden");
    }

    if (loginLink) {
        loginLink.addEventListener("click", function (event) {
            event.preventDefault();
            window.location.href = "login-signup.html";
        });
    }

    if (logoutLink) {
        logoutLink.addEventListener("click", function () {
            localStorage.clear();
            location.reload();
        });
    }

    // Cập nhật username trong menu
    const username = localStorage.getItem("username");
    if (accountLink) {
        accountLink.textContent = username ? username.toUpperCase() : "YOUR ACCOUNT";
        accountLink.href = username ? "profile.html" : "login-signup.html";
    }
    if (profileLink) {
        profileLink.textContent = username ? username.toUpperCase() : "TRANG CÁ NHÂN";
        profileLink.href = username ? "profile.html" : "login-signup.html";
    }
});
