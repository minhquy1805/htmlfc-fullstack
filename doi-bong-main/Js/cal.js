
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let matchMap = {}; // Dạng: { 'YYYY-MM-DD': [match1, match2, ...] }

document.addEventListener("DOMContentLoaded", () => {
  loadMatches().then(() => {
    renderCalendar(currentMonth, currentYear);
  });

  document.getElementById("prev").addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
  });

  document.getElementById("next").addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
  });
});

async function loadMatches() {
  try {
    const response = await fetch("http://35.247.156.29:8080/api/v1/CalendarApi/selectall");
    const data = await response.json();

    data.forEach(match => {
        const date = new Date(match.calendarTime).toLocaleDateString("sv-SE"); // YYYY-MM-DD theo local time

        if (!matchMap[date]) matchMap[date] = [];
        matchMap[date].push(match);
    });
  } catch (err) {
    console.error("Lỗi tải dữ liệu lịch:", err);
  }
}

function renderCalendar(month, year) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    document.getElementById("calendar-title").innerText =
            new Date(year, month).toLocaleString("vi-VN", { month: "long", year: "numeric" });

    const calendarDays = document.getElementById("calendar-days");
    calendarDays.innerHTML = "";

    for (let i = 0; i < firstDay; i++) {
        calendarDays.innerHTML += `<div class="col day empty"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const hasMatch = !!matchMap[dateStr];

        calendarDays.innerHTML += `
        <div class="col day${hasMatch ? ' match-day bg-warning text-dark' : ''}" data-date="${dateStr}">
            ${day}
        </div>
        `;
    }

    document.querySelectorAll(".match-day").forEach(el => {
        el.addEventListener("click", (e) => {
        const date = e.currentTarget.getAttribute("data-date");
        const matches = matchMap[date];

        const infoDiv = document.getElementById("match-info");
        const details = document.getElementById("match-details");

        if (matches && matches.length > 0) {
            const html = matches.map(m => `
            <strong>${m.title}</strong> <br>
            Loại: ${m.event} <br>
            Thời gian: ${new Date(m.calendarTime).toLocaleString("vi-VN")}
            `).join("<hr>");

            details.innerHTML = html;
            infoDiv.style.display = "block";
        }
        });
    });
}

