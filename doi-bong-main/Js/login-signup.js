
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const showSignup = document.getElementById("show-signup");
    const showLogin = document.getElementById("show-login");
    const formTitle = document.getElementById("form-title");

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

    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const username = loginForm.querySelector("input[type='text']").value;
            const password = loginForm.querySelector("input[type='password']").value;

            if (!username || !password) {
                alert("Vui lòng nhập đầy đủ tài khoản và mật khẩu.");
                return;
            }

            try {
                const res = await fetch("http://35.247.156.29:8080/api/v1/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });

                const text = await res.text();
                let data = {};
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    throw new Error("Phản hồi từ server không hợp lệ.");
                }

                if (!res.ok) {
                    alert(data.message || "Sai tài khoản hoặc mật khẩu.");
                    return;
                }

                const accessToken = data.accessToken;
                const refreshToken = data.refreshToken;

                if (!accessToken || !refreshToken) {
                    throw new Error("Thiếu accessToken hoặc refreshToken.");
                }

                if (typeof accessToken !== "string" || accessToken.split(".").length !== 3) {
                    throw new Error("AccessToken không đúng định dạng JWT.");
                }

                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);

                let decodedToken = null;
                try {
                    decodedToken = jwt_decode(accessToken);
                } catch (decodeError) {
                    alert("Token lỗi. Vui lòng đăng nhập lại.");
                    window.authUtils.logout();
                    return;
                }

                const memberId = decodedToken.nameid;
                const role = decodedToken.role;

                if (!memberId) {
                    alert("Không tìm thấy MemberId trong token.");
                    return;
                }

                localStorage.setItem("MemberId", memberId);
                localStorage.setItem("role", role);

                if (role === "admin") {
                    window.location.href = "/admin.html";
                } else {
                    window.location.href = "/index.html";
                }

            } catch (error) {
                alert(error.message);
            }
        });
    }

    // xu ly dang ki

    signupForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const username = signupForm.querySelector("input[type='text']").value;
        const email = signupForm.querySelector("input[type='email']").value;
        const password = signupForm.querySelector("input[type='password']").value;

        try {
            const res = await fetch("http://35.247.156.29:8080/api/v1/MemberApi/insert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const text = await res.text();
            let data = {};
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.warn("Phản hồi không hợp lệ:", text);
            }

            if (!res.ok) throw new Error(data.message || text || "Đăng ký thất bại.");

            alert("Đăng ký thành công! Kiểm tra email để xác thực.");
            signupForm.classList.add("hidden");
            verifyContainer.classList.remove("hidden");
            localStorage.setItem("verifying_email", email);

        } catch (error) {
            alert(error.message);
        }
    });

    verifyButton.addEventListener("click", async function (e) {
        e.preventDefault();
        const email = localStorage.getItem("verifying_email");
        const code = verifyInput.value.trim();

        if (!code || !email) {
            alert("Vui lòng nhập mã xác thực và email hợp lệ.");
            return;
        }

        try {
            const res = await fetch("http://35.247.156.29:8080/api/v1/verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code }),
            });

            const text = await res.text();
            let data = {};
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.warn("Phản hồi không hợp lệ:", text);
            }

            if (!res.ok) throw new Error(data.message || text || "Xác thực thất bại.");

            alert("Xác thực thành công! Hãy đăng nhập.");
            verifyContainer.classList.add("hidden");
            loginForm.classList.remove("hidden");
            formTitle.innerText = "Đăng Nhập";
            localStorage.removeItem("verifying_email");

        } catch (error) {
            alert(error.message);
        }
    });

    resendButton.addEventListener("click", async function (e) {
        e.preventDefault();
        const email = localStorage.getItem("verifying_email");

        if (!email) {
            alert("Không tìm thấy email để gửi lại mã.");
            return;
        }

        try {
            const res = await fetch("http://35.247.156.29:8080/api/v1/resend-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const text = await res.text();
            let data = {};
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.warn("Phản hồi không hợp lệ:", text);
            }

            if (!res.ok) throw new Error(data.message || text || "Gửi lại mã thất bại.");

            alert("Mã xác thực đã được gửi lại vào email.");
        } catch (error) {
            alert(error.message);
        }
    });
});
