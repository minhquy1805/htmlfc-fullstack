document.addEventListener("DOMContentLoaded", function () {
    const memberId = localStorage.getItem("MemberId");
    const token = localStorage.getItem("accessToken");

    if (!memberId || !token) {
        console.error("❌ Thiếu MemberId hoặc accessToken trong localStorage.");
        alert("Vui lòng đăng nhập lại.");
        window.location.href = "login-signup.html";
        return;
    }

    // API lấy thông tin thành viên
    fetch(`http://35.247.156.29:8080/api/v1/MemberApi/selectbyprimarykey?id=${memberId}`, {
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
            // Avatar
            const avatar = data.avatar || "Pic/default-avatar.jpg";
            document.querySelector(".profile-img").src = avatar;

            // Tên, số áo, vị trí tạm thời để sau
            const fullName = `${data.firstname || ""} ${data.middlename || ""} ${data.lastname || ""}`.trim();
            document.querySelector(".player-name").textContent = fullName;
            document.querySelector(".player-number").textContent = `Số áo: ${data.numberPlayer || "-"}`;
            document.querySelector(".player-position").textContent = "Đang cập nhật";
            document.querySelector(".player-age").textContent = "Tuổi: Đang cập nhật";

            // Phần thông tin bên phải
            const profileRight = document.querySelector(".profile-right");
            profileRight.innerHTML = `
                <div class="info-box">
                    <p><strong>User Name:</strong> ${data.username || ""}</p>
                </div>

                <div class="info-box" id="achievement-box">
                    <p><strong>Thành tích:</strong> <span id="achievement-content">Đang tải...</span></p>
                </div>

                <div class="info-box">
                    <p><strong>SDT:</strong> ${data.phone || "Chưa có"}</p>
                </div>

                <div class="info-box">
                    <p><strong>Email:</strong> ${data.email || "Chưa có"}</p>
                </div>
            `;

            // Lấy thành tích nếu có
            const certificateId = data.type;
            if (certificateId) {
                fetch(`http://35.247.156.29:8080/api/v1/CertificateTypeApi/selectbyprimarykey?id=${certificateId}`, {
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
                        document.querySelector(".player-position").textContent = cert.name || "Chưa rõ";
                    })
                    .catch(err => {
                        console.warn("⚠️ Không thể tải thành tích:", err);
                        document.getElementById("achievement-content").textContent = "Không thể tải thành tích";
                    });
            } else {
                document.getElementById("achievement-content").textContent = "Không có dữ liệu";
            }
        })
        .catch(err => {
            console.error("❌ Lỗi khi lấy thông tin người dùng:", err);
            alert("Không thể lấy thông tin người dùng. Vui lòng thử lại.");
        });
});
