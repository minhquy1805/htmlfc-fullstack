// Gọi API lấy tin tức
async function fetchNews() {
    try {
        const res = await fetch("http://35.247.156.29:8080/api/v1/NewsApi/selectall");
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("❌ Lỗi tải tin tức:", err);
        return [];
    }
}

// Hiển thị tin tức ra giao diện
function renderNews(newsList) {
    const container = document.createElement("div");
    container.classList.add("row", "news-results");

    newsList.forEach(news => {
        const card = document.createElement("div");
        card.className = "col-md-4";
        card.innerHTML = `
            <div class="news-card">
                <img src="${news.image}" alt="${news.title}">
                <h5>${news.title}</h5>
                <p>${news.lead}</p>
            </div>
        `;
        container.appendChild(card);
    });

    const contentContainer = document.querySelector(".content .container");
    const existing = document.querySelector(".news-results");
    if (existing) existing.remove();
    contentContainer.appendChild(container);
}

// Lọc tin tức theo từ khóa
function filterNews(keyword, allNews) {
    const lower = keyword.toLowerCase();
    return allNews.filter(news =>
        news.title.toLowerCase().includes(lower) ||
        news.lead.toLowerCase().includes(lower)
    );
}

// Xử lý sự kiện DOM
document.addEventListener("DOMContentLoaded", async () => {
    const allNews = await fetchNews();
    renderNews(allNews);

    document.getElementById("searchInput").addEventListener("input", function () {
        const keyword = this.value.trim();
        const filtered = filterNews(keyword, allNews);
        renderNews(filtered);
    });
});


