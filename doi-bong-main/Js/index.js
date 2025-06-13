
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



// countdown
// Set the target date and time
const targetDate = new Date("2025-02-23T10:00:00").getTime();

// Update the countdown every 1 second
const updateCountdown = () => {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance > 0) {
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = String(days).padStart(2, "0");
    document.getElementById("hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
  } else {
    document.querySelector(".countdown-container").innerHTML = "Time's up!";
  }
};

setInterval(updateCountdown, 1000);
updateCountdown();

// lich dau thu gon
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
                <td>${match.event}</td>
                <td>${formatMatchTime(match.calendarTime)}</td>
            `;

            tableBody.appendChild(row);
        });
    })
    .catch(err => {
        console.error("Lỗi khi tải lịch đấu:", err);
    });










