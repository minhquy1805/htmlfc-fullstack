import { useEffect, useState } from "react";
import {
  Table,
  Typography,
  message,
  Space,
  Button,
  Tooltip,
  Row,
  Col,
} from "antd";
import {
  getCertificates,
  deleteCertificate,
  
} from "../services/api";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import EditCertificateModal from "./EditCertificateModal";
import Swal from "sweetalert2";
import moment from "moment";

const { Title } = Typography;

export default function CertificateList() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchCertificates = async () => {
    try {
      const data = await getCertificates();
      setCertificates(data);
    } catch (err) {
      message.error("Không thể lấy danh sách chứng chỉ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleDelete = async (cert) => {
    const title = cert.title;

    const result = await Swal.fire({
      title: "Xác nhận xóa",
      text: `Bạn có chắc muốn xóa chứng chỉ '${title}'?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await deleteCertificate(cert.certificateId);
        await Swal.fire({
          icon: "success",
          title: "Đã xóa!",
          text: `Chứng chỉ '${title}' đã được xóa.`,
          timer: 1500,
          showConfirmButton: false,
        });
        fetchCertificates();
      } catch (err) {
        Swal.fire("Lỗi", "Không thể xóa chứng chỉ.", "error");
      }
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "certificateId",
      key: "certificateId",
      width: 80,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Loại chứng chỉ",
      dataIndex: ["certificateType", "certificateTitle"],
      key: "certificateTypeTitle",
    },
    {
      title: "Ngày cấp",
      dataIndex: "dateCert",
      key: "dateCert",
      render: (date) => (date ? moment(date).format("DD/MM/YYYY") : "")
    },
    {
      title: "Người ký",
      dataIndex: "signCert",
      key: "signCert",
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/certificate/${record.certificateId}`)}
            />
          </Tooltip>
          <Tooltip title="Sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setEditing(record);
                setIsModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            Danh sách chứng chỉ
          </Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/certificate/insert")}
          >
            Thêm chứng chỉ
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={certificates}
        rowKey="certificateId"
        loading={loading}
        bordered
        scroll={{ x: "max-content" }}
      />

      <EditCertificateModal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditing(null);
        }}
        onOk={async () => {
            await fetchCertificates();
            setIsModalOpen(false);
            setEditing(null);
        }}
        initialValues={editing}
      />
    </div>
  );
}
