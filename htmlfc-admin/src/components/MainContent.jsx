import MatchCalendarPro from "./MatchCalendarPro";
import NewsStats from "./NewsStats";
import UserVerificationChart from "./UserVerificationChart";
import { Typography, Row, Col, Divider } from "antd";

const { Title, Paragraph } = Typography;

export default function MainContent() {
  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Dashboard</Title>
      <Paragraph>Chào mừng bạn đến với hệ thống HTMLFC.</Paragraph>

      <div style={{ marginBottom: "32px" }}>
        <MatchCalendarPro />
      </div>

      <Divider />

      <Row gutter={[24, 24]}>
        <Col
          xs={24}
          md={12}
          style={{
            marginBottom: 24, // áp dụng trên mobile (xs), sẽ bị override bởi md
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              height: "100%",
            }}
          >
            <NewsStats />
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              height: "100%",
            }}
          >
            <UserVerificationChart />
          </div>
        </Col>
      </Row>
    </div>
  );
}
