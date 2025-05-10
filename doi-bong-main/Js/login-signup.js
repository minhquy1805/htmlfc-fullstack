document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const showSignup = document.getElementById("show-signup");
    const showLogin = document.getElementById("show-login");
    const formTitle = document.getElementById("form-title");

    // ========== Thêm phần tử xác thực email ==========
    const verifyContainer = document.createElement("div");
    verifyContainer.classList.add("hidden", "mt-4");
    verifyContainer.innerHTML = `
        <h5>Nhập mã xác thực email</h5>
        <input type="text" id="verification-code" class="form-control mb-2" placeholder="Mã xác thực từ email">
        <button id="verify-button" class="btn btn-primary w-100 mb-2">Xác thực</button>
        <button id="resend-button" class="btn btn-secondary w-100">Gửi lại mã xác thực</button>
    `;
    document.querySelector(".auth-container").appendChild(verifyContainer);

    const verifyInput = document.getElementById("verification-code");
    const verifyButton = document.getElementById("verify-button");
    const resendButton = document.getElementById("resend-button");

    const token = localStorage.getItem("token");
    if (token) {
        try {
            const decodedToken = jwt_decode(token);
            const role = decodedToken.role;
            const memberId = decodedToken.nameid;

            if (memberId) {
                localStorage.setItem("MemberId", memberId);
            }
            if (role) {
                localStorage.setItem("role", role);
            }

            if (role === "admin") {
                console.log("Đang đăng nhập với quyền admin.");
            } else {
                console.log("Đang đăng nhập với quyền user.");
            }
        } catch (error) {
            console.error("Lỗi giải mã token:", error);
            alert("Token không hợp lệ.");
        }
    }

    showSignup.addEventListener("click", function (e) {
        e.preventDefault();
        loginForm.classList.add("hidden");
        signupForm.classList.remove("hidden");
        verifyContainer.classList.add("hidden");
        formTitle.innerText = "Đăng Ký";
    });

    showLogin.addEventListener("click", function (e) {
        e.preventDefault();
        signupForm.classList.add("hidden");
        loginForm.classList.remove("hidden");
        verifyContainer.classList.add("hidden");
        formTitle.innerText = "Đăng Nhập";
    });

    // Xử lý đăng nhập
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const username = loginForm.querySelector("input[type='text']").value;
        const password = loginForm.querySelector("input[type='password']").value;

        try {
            const res = await fetch("https://localhost:7068/api/v1/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const text = await res.text();
            let data = {};
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.warn("Phản hồi không phải JSON hợp lệ:", text);
            }

            if (!res.ok) throw new Error(data.message || text || "Đăng nhập thất bại.");

            const token = data.token;
            console.log("Token:", token);

            localStorage.setItem("token", token);

            let decodedToken = null;

            try {
                decodedToken = jwt_decode(token);
                console.log("Decoded Token:", decodedToken);
            } catch (decodeError) {
                console.error("❌ Không thể giải mã token:", decodeError);
                alert("Token không hợp lệ. Vui lòng đăng nhập lại.");
                // localStorage.removeItem("token");
                return;
            }


            const memberId = decodedToken.nameid;
            const role = decodedToken.role;

            if (!memberId) {
                console.error("MemberId không tồn tại trong token.");
                alert("Lỗi: Không tìm thấy MemberId trong token.");
                return;
            }

            localStorage.setItem("MemberId", memberId);
            localStorage.setItem("role", role);

            checkUserRole(role);

        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            alert(error.message);
        }
    });

    function checkUserRole(role) {
        if (role === "admin") {
            window.location.href = "/admin.html";
        } else {
            window.location.href = "/index.html";
        }
    }

    // Xử lý đăng ký
    signupForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const username = signupForm.querySelector("input[type='text']").value;
        const email = signupForm.querySelector("input[type='email']").value;
        const password = signupForm.querySelector("input[type='password']").value;

        try {
            const res = await fetch("https://localhost:7068/api/v1/MemberApi/insert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const text = await res.text();
            let data = {};
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.warn("Phản hồi không phải JSON hợp lệ:", text);
            }

            if (!res.ok) throw new Error(data.message || text || "Đăng ký thất bại.");

            alert("Đăng ký thành công! Vui lòng kiểm tra email và nhập mã xác thực.");

            signupForm.classList.add("hidden");
            verifyContainer.classList.remove("hidden");

            localStorage.setItem("verifying_username", username);
            localStorage.setItem("verifying_email", email);

        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            alert(error.message);
        }
    });

        // Xác thực email
    verifyButton.addEventListener("click", async function (e) {
        e.preventDefault();
        const email = localStorage.getItem("verifying_email");
        const code = verifyInput.value.trim();

        if (!code || !email || email === "null" || email.trim() === "") {
            alert("Vui lòng nhập mã xác thực và đảm bảo email hợp lệ.");
            return;
        }

        try {
            const res = await fetch("https://localhost:7068/api/v1/verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code }), // ✅ truyền email
            });

            const text = await res.text();
            let data = {};
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.warn("❗ Phản hồi không phải JSON hợp lệ:", text);
            }

            if (!res.ok) {
                console.error("❌ Xác thực thất bại:", data.message || text);
                throw new Error(data.message || text || "Xác thực thất bại.");
            }

            alert("✅ Xác thực thành công! Hãy đăng nhập.");
            verifyContainer.classList.add("hidden");
            loginForm.classList.remove("hidden");
            formTitle.innerText = "Đăng Nhập";

            // Dọn localStorage
            localStorage.removeItem("verifying_username");
            localStorage.removeItem("verifying_email");

        } catch (error) {
            console.error("💥 Lỗi xác thực:", error);
            alert(error.message || "Đã xảy ra lỗi trong quá trình xác thực.");
        }
    });



    // Gửi lại mã xác thực
    resendButton.addEventListener("click", async function (e) {
        e.preventDefault();
        const email = localStorage.getItem("verifying_email");

        if (!email) {
            alert("Không tìm thấy email để gửi lại mã.");
            return;
        }

        try {
            const res = await fetch("https://localhost:7068/api/v1/resend-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const text = await res.text();
            let data = {};
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.warn("Phản hồi không phải JSON hợp lệ:", text);
            }

            if (!res.ok) throw new Error(data.message || text || "Gửi lại mã thất bại.");

            alert("Mã xác thực đã được gửi lại vào email.");
        } catch (error) {
            console.error("Lỗi gửi lại mã:", error);
            alert(error.message);
        }
    });
});
