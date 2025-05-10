function paginateNews(containerId, paginationId, newsList, itemsPerPage = 6) {
    let currentPage = 1;
    function displayNews(page) {
        $(containerId).empty();
        let start = (page - 1) * itemsPerPage;
        let end = start + itemsPerPage;
        let paginatedItems = newsList.slice(start, end);
        paginatedItems.forEach(news => {
            $(containerId).append(`
                <div class="col-md-4">
                    <div class="news-card">
                        <img src="${news.image}" alt="${news.title}">
                        <h5>${news.title}</h5>
                        <p>${news.description}</p>
                        <button class="btn btn-custom">Xem thêm</button>
                    </div>
                </div>
            `);
        });
    }
    function setupPagination() {
        $(paginationId).empty();
        let pageCount = Math.ceil(newsList.length / itemsPerPage);
        for (let i = 1; i <= pageCount; i++) {
            $(paginationId).append(`<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link" href="#">${i}</a></li>`);
        }
        $(paginationId + ' .page-link').click(function(event) {
            event.preventDefault();
            currentPage = parseInt($(this).text());
            displayNews(currentPage);
            setupPagination();
        });
    }
    displayNews(currentPage);
    setupPagination();
}

$(document).ready(function(){
    const tinTrongNuoc = new Array(12).fill({ image: "news1.jpg", title: "Tin Trong Nước", description: "Mô tả tin trong nước." });
    const tinTheGioi = new Array(12).fill({ image: "news2.jpg", title: "Tin Thế Giới", description: "Mô tả tin thế giới." });
    const tinMoi = new Array(12).fill({ image: "news3.jpg", title: "Tin Mới", description: "Mô tả tin mới nhất." });
    paginateNews("#tin-trong-nuoc", "#pagination-tin-trong-nuoc", tinTrongNuoc);
    paginateNews("#tin-the-gioi", "#pagination-tin-the-gioi", tinTheGioi);
    paginateNews("#tin-moi", "#pagination-tin-moi", tinMoi);

    $("#searchInput").on("keyup", function() {
        let value = $(this).val().toLowerCase();
        $(".news-card").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});