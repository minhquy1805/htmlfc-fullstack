
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



// nut xem them 
document.addEventListener('DOMContentLoaded', function () {
  const posts = document.querySelectorAll('.post-grid-item'); // Lấy tất cả bài viết
  const initialVisible = 8; // Số bài viết hiển thị ban đầu

  // Ẩn tất cả bài viết vượt quá số lượng ban đầu
  posts.forEach((post, index) => {
      if (index >= initialVisible) {
          post.classList.add('hidden');
      }
  });

  // Thêm sự kiện cho nút "Xem Thêm"
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  loadMoreBtn.addEventListener('click', function () {
      let count = 0;

      // Hiển thị thêm tối đa 4 bài viết
      posts.forEach(post => {
          if (post.classList.contains('hidden') && count < 4) {
              post.classList.remove('hidden');
              count++;
          }
      });

      // Ẩn nút "Xem Thêm" nếu không còn bài viết nào để hiển thị
      if (document.querySelectorAll('.post-grid-item.hidden').length === 0) {
          loadMoreBtn.style.display = 'none';
      }
  });
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











