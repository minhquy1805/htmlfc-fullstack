import { useEffect, useState } from "react";
import { Table, Typography, message, Space, Button, Tooltip, Row, Col } from "antd";
import { getCertificateTypes, deleteCertificateType } from "../services/api";
import { useNavigate } from "react-router-dom";
import EditCertificateTypeModal from "./EditCertificateTypeModal";
import Swal from "sweetalert2";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

export default function CertificateTypeList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Tách riêng fetch list
  const fetchTypes = async () => {
    try {
      const data = await getCertificateTypes();
      setList(data);
    } catch (err) {
      message.error("Không thể lấy danh sách loại chứng chỉ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleDelete = async (certificateType) => {
    const certificateTitle = certificateType.certificateTitle.trim();

    const result = await Swal.fire({
      title: `Xác nhận xóa`,
      text: `Bạn có chắc muốn xóa ${certificateTitle}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await deleteCertificateType(certificateType.certificateTypeId);
        await Swal.fire({
          icon: "success",
          title: "Đã xóa!",
          text: `${certificateTitle} đã được xóa.`,
          timer: 1500,
          showConfirmButton: false,
        });
        fetchTypes();
      } catch (err) {
        Swal.fire("Lỗi", "Không thể xóa loại chứng chỉ.", "error");
      }
    }
  };

  const handleEdit = (record) => {
    setEditing(record);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "certificateTypeId",
      key: "certificateTypeId",
      width: 200,
    },
    {
      title: "Tên loại chứng chỉ",
      dataIndex: "certificateTitle",
      key: "certificateTitle",
    },
    {
      title: "Hành động",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space>
          <Tooltip title="Chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/certificate-type/${record.certificateTypeId}`)}
            />
          </Tooltip>
          <Tooltip title="Sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
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
            Danh sách loại chứng chỉ
          </Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/certificate-type/insert")}
          >
            Thêm loại chứng chỉ
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={list}
        rowKey="certificateTypeId"
        loading={loading}
        bordered
        scroll={{ x: "max-content" }}
      />

      <EditCertificateTypeModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => {
          setIsModalOpen(false);
          Swal.fire("Thành công", "Cập nhật chứng chỉ thành công!", "success");
          fetchTypes();
        }}
        initialValues={editing}
      />
    </div>
  );
}
