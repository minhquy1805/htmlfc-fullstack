let certificates = [];

function renderCertificates(list) {
    const container = document.getElementById('certificateList');
    container.innerHTML = '';
    if (list.length === 0) {
        container.innerHTML = '<div class="col-12 text-center text-muted">Không có chứng chỉ nào.</div>';
        return;
    }
    list.forEach(cert => {
        const date = new Date(cert.dateCert).toLocaleDateString('vi-VN');
        container.innerHTML += `
            <div class="col-md-4">
                <div class="card certificate-card">
                    <div class="card-body">
                        <h5 class="card-title">Tên chứng chỉ: <span class="cert-title">${cert.title}</span></h5>
                        <p class="card-text">Nội dung: <span class="cert-content">${cert.contentCert}</span></p>
                        <p class="card-text">Ngày cấp: <span class="cert-date">${date}</span></p>
                        <p class="card-text">Người ký: <span class="cert-sign">${cert.signCert}</span></p>
                        <p class="card-text">Lý do: <span class="cert-reason">${cert.reasonCert}</span></p>
                        <p class="card-text">Loại chứng chỉ: <span class="cert-type">${cert.certificateType?.certificateTitle || ''}</span></p>
                    </div>
                </div>
            </div>
        `;
    });
}

function searchCertificate() {
    const keyword = document.getElementById('searchCert').value.toLowerCase();
    const filtered = certificates.filter(cert =>
        cert.title.toLowerCase().includes(keyword) ||
        cert.contentCert.toLowerCase().includes(keyword) ||
        cert.signCert.toLowerCase().includes(keyword) ||
        cert.reasonCert.toLowerCase().includes(keyword) ||
        (cert.certificateType?.certificateTitle || '').toLowerCase().includes(keyword)
    );
    renderCertificates(filtered);
}

// Fetch dữ liệu từ API khi trang load
document.addEventListener('DOMContentLoaded', function() {
    fetch('http://35.247.156.29:8080/api/v1/CertificateApi/selectall')
        .then(res => res.json())
        .then(data => {
            certificates = data;
            renderCertificates(certificates);
        })
        .catch(() => {
            certificates = [];
            renderCertificates(certificates);
        });
});