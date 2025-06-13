
// tabs content
document.addEventListener('DOMContentLoaded', function () {
  const tabsNav = document.querySelectorAll('#category-filter li');
  const tabContents = document.querySelectorAll('.card-content');

  tabsNav[0].classList.add('active-category');
  tabContents.forEach((tab, index) => {
      if (index !== 0) tab.style.display = 'none';
  });

  tabsNav.forEach(tab => {
      tab.addEventListener('click', function () {
          tabsNav.forEach(t => t.classList.remove('active-category'));
          tab.classList.add('active-category');

          tabContents.forEach(content => content.style.display = 'none');
          const activeTab = tab.querySelector('a').getAttribute('href');
          console.log(activeTab);
          document.querySelector(activeTab).style.display = 'block';
      })
  })
});



// thong tin cac news
function formatDate(isoDateStr) {
    const date = new Date(isoDateStr);
    return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

function loadNews(newsList, targetSelector, startIndex = 0, limit = 4) {
    const container = document.querySelector(`${targetSelector} .post-grid`);
    if (!container) return;

    container.innerHTML = "";
    const sliced = newsList.slice(startIndex, startIndex + limit);

    sliced.forEach(news => {
        const div = document.createElement("div");
        div.className = "post-grid-item col-sm-6";
        div.innerHTML = `
            <div class="posts-item posts-item--card posts-item--category-2 card">
                <figure class="posts-thumb">
                    <a href="news-detail.html?id=${news.newsId}">
                        <img src="${news.image}" alt="${news.title}">
                    </a>
                </figure>
                <div class="posts-thumb-content">
                    <h6 class="posts-title">
                        <time datetime="${news.createdAt}" class="posts-date">${formatDate(news.createdAt)}</time>
                        <a href="news-detail.html?id=${news.newsId}">${news.title}</a>
                    </h6>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

// Gọi API và chia tin ra 2 phần
fetch("http://35.247.156.29:8080/api/v1/NewsApi/selectall")
    .then(res => res.json())
    .then(data => {
        if (!Array.isArray(data)) return;

        loadNews(data, "#latestNewsBlock1", 0, 4);   // tin đầu tiên
        loadNews(data, "#latestNewsBlock2", 4, 2);   // tiếp theo 4 tin
    })
    .catch(err => {
        console.error("Lỗi khi gọi API tin tức:", err);
    });



// dem nguoc tran dau gan nhat dien ra
  async function fetchNextMatchPreview() {
    const response = await fetch("http://35.247.156.29:8080/api/v1/CalendarApi/selectall");
    const data = await response.json();
    const container = document.querySelector(".match-preview");

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = `<p style="text-align:center; font-weight:bold;">Không có trận đấu sắp tới</p>`;
      return;
    }

    const now = new Date();

    // Lọc trận có lịch thi đấu >= hiện tại
    const upcomingMatches = data
      .filter(match => new Date(match.calendarTime) >= now)
      .sort((a, b) => new Date(a.calendarTime) - new Date(b.calendarTime));

    if (upcomingMatches.length === 0) {
      container.innerHTML = `<p style="text-align:center; font-weight:bold;">Không có trận đấu sắp tới</p>`;
      return;
    }

    const match = upcomingMatches[0];
    const matchDate = new Date(match.calendarTime);
    const formattedDate = matchDate.toLocaleDateString("vi-VN");

    // Cập nhật HTML
    container.querySelector(".match-preview-date").innerText = formattedDate;
    container.querySelector(".match-preview-date").setAttribute("datetime", match.calendarTime);
    container.querySelector(".match-preview-title").innerText = match.event || "Giao Hữu";

    // Tách tên đội từ title nếu có dạng "Team A vs Team B"
    const teams = match.title.split(" vs ");
    container.querySelector(".match-preview-team--first .match-preview-team-name").innerText = teams[0] || "Đội 1";
    container.querySelector(".match-preview-team--second .match-preview-team-name").innerText = teams[1] || "Đội 2";

    // Bắt đầu countdown
    startCountdown(matchDate);
  }

  function startCountdown(matchDate) {
    const countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = matchDate.getTime() - now;

      if (distance < 0) {
        clearInterval(countdownInterval);
        document.querySelector(".countdown-container").innerHTML = `<p style="text-align:center;">Đã diễn ra</p>`;
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      document.getElementById("days").innerText = String(days).padStart(2, "0");
      document.getElementById("hours").innerText = String(hours).padStart(2, "0");
      document.getElementById("minutes").innerText = String(minutes).padStart(2, "0");
      document.getElementById("seconds").innerText = String(seconds).padStart(2, "0");
    }, 1000);
  }

  document.addEventListener("DOMContentLoaded", fetchNextMatchPreview);


// lich dau thu gon , danh sach
function formatMatchTime(isoDateTime) {
    const date = new Date(isoDateTime);
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) +
           " " +
           date.toLocaleDateString("vi-VN");
}

fetch("http://35.247.156.29:8080/api/v1/CalendarApi/selectall")
    .then(res => res.json())
    .then(data => {
        const tableBody = document.getElementById("matchScheduleBody");
        if (!tableBody || !Array.isArray(data)) return;

        tableBody.innerHTML = "";

        data.forEach(match => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${match.title}</td>
                <td>${formatMatchTime(match.calendarTime)}</td>
            `;

            tableBody.appendChild(row);
        });
    })
    .catch(err => {
        console.error("Lỗi khi tải lịch đấu:", err);
    });










