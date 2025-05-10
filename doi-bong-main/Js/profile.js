
// Lấy token từ localStorage
const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", function () {

    // Nếu không có token, chuyển hướng về trang đăng nhập
    if (!token) {
        alert("Bạn cần đăng nhập để truy cập trang này!");
        window.location.href = "login-signup.html"; // Đổi thành trang đăng nhập của bạn
    } else {
        // Giải mã token để lấy thông tin người dùng
        try {
            const decodedToken = jwt_decode(token);

            // Kiểm tra token đã hết hạn hay chưa
            const currentTime = Date.now() / 1000; // Thời gian hiện tại (giây)
            if (decodedToken.exp < currentTime) {
                alert("Phiên đăng nhập của bạn đã hết hạn!");
                window.location.href = "login-signup.html"; // Đổi lại trang đăng nhập
                return;
            }

            // Token hợp lệ, bạn có thể tiếp tục xử lý ở đây
            console.log("Token hợp lệ, vẫn còn thời gian sử dụng");
            // Tiến hành hiển thị thông tin hoặc thực hiện các tác vụ khác.

        } catch (error) {
            alert("Lỗi giải mã token!");
            window.location.href = "login-signup.html";
        }
    }
});

// sua thong tin ca nhan

const memberId = localStorage.getItem("MemberId");

if (!memberId || !token) {
    console.error("Thiếu MemberId hoặc token trong localStorage");
} else {
    // Fetch thông tin người dùng
    fetch(`https://localhost:7068/api/v1/MemberApi/selectbyprimarykey?id=${memberId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) throw new Error("Không thể lấy thông tin người dùng");
            return response.json();
        })
        .then(data => {
            // Avatar (đường dẫn đã được xử lý từ backend)
            document.querySelector(".profile-img").src = data.avatar || "Pic/default-avatar.jpg";

            // Hiển thị thông tin bên trái
            document.querySelector(".player-name").textContent = `${data.firstname} ${data.middlename} ${data.lastname}`;
            document.querySelector(".player-number").textContent = `Số áo: ${data.numberPlayer || "-"}`;
            document.querySelector(".player-position").textContent = "";
            document.querySelector(".player-age").textContent = "";

            // Thông tin bên phải (có chỗ chờ thành tích)
            document.querySelector(".profile-right").innerHTML = `
                <div class="info-box">
                    <p><strong>User Name:</strong> ${data.firstname}${data.lastname}</p>
                </div>

                <div class="info-box" id="achievement-box">
                    <p><strong>Thành tích:</strong> <span id="achievement-content">Đang tải...</span></p>
                </div>

                <div class="info-box">
                    <p><strong>SDT:</strong> ${data.phone}</p>
                </div>

                <div class="info-box">
                    <p><strong>Email:</strong> ${data.email}</p>
                </div>
            `;

            // Fetch thành tích dựa vào type (chính là certificateId)
            const certificateId = data.type;
            fetch(`https://localhost:7068/api/v1/CertificateTypeApi/selectbyprimarykey?id=${certificateId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
                .then(res => {
                    if (!res.ok) throw new Error("Không thể lấy thành tích");
                    return res.json();
                })
                .then(cert => {
                    const achievementText = `${cert.name || "Không rõ"} - ${cert.description || ""}`;
                    document.getElementById("achievement-content").textContent = achievementText;
                    document.querySelector(".player-position").textContent = cert.name || "";
                })
                .catch(err => {
                    console.error("Lỗi khi lấy thành tích:", err);
                    document.getElementById("achievement-content").textContent = "Không thể tải thành tích";
                });
        })
        .catch(error => {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
        });
}


