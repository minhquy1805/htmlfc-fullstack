import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Card, Spin, message } from "antd";
import { getCertificateTypeById } from "../services/api";

const { Title, Text } = Typography;

export default function CertificateTypeDetail() {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificateType = async () => {
      try {
        const data = await getCertificateTypeById(id);
        setCertificate(data);
      } catch (err) {
        message.error("Không thể lấy thông tin loại chứng chỉ.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificateType();
  }, [id]);

  if (loading) {
    return <Spin tip="Đang tải dữ liệu..." />;
  }

  if (!certificate) {
    return <Text type="danger">Không tìm thấy loại chứng chỉ.</Text>;
  }

  return (
    <Card title="Chi tiết loại chứng chỉ" bordered={false}>
      <Title level={4}>ID: {certificate.certificateTypeId}</Title>
      <Text strong>Tên loại chứng chỉ:</Text>
      <p>{certificate.certificateTitle}</p>
    </Card>
  );
}
