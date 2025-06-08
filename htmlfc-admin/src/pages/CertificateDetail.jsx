import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCertificateById } from "../services/api";
import { Typography, Descriptions, Spin, message, Button } from "antd";
import moment from "moment";
import { exportCertificatePDF } from "../helper/exportCertificatePDF";

const { Title } = Typography;

export default function CertificateDetail() {
  const { certificateId } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await getCertificateById(certificateId);
        setCertificate(data);
      } catch {
        message.error("Không thể tải chi tiết chứng chỉ.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [certificateId]);

  if (loading) {
    return <Spin tip="Đang tải..." />;
  }

  if (!certificate) {
    return <p>Không tìm thấy chứng chỉ.</p>;
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <Title level={3}>Chi tiết chứng chỉ</Title>

      <Descriptions bordered column={1}>
        <Descriptions.Item label="Tiêu đề">{certificate.title}</Descriptions.Item>
        <Descriptions.Item label="Loại chứng chỉ">
          {certificate.certificateType?.certificateTitle || "Không xác định"}
        </Descriptions.Item>
        <Descriptions.Item label="Nội dung">
          {certificate.contentCert || "Không có"}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày cấp">
          {certificate.dateCert ? moment(certificate.dateCert).format("DD/MM/YYYY") : ""}
        </Descriptions.Item>
        <Descriptions.Item label="Người ký">{certificate.signCert || "Không có"}</Descriptions.Item>
        <Descriptions.Item label="Lý do cấp">{certificate.reasonCert || "Không có"}</Descriptions.Item>
      </Descriptions>

     <Button type="primary" onClick={() => exportCertificatePDF(certificate)}>
        Xuất PDF
     </Button>

     
    </div>
  );
}
