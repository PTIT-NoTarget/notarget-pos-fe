import { Card, Col, DatePicker, Divider, Row, Space } from "antd";
import dayjs from "dayjs";
import { ContainerFilled, AccountBookFilled } from "@ant-design/icons";
import "../assets/Home.css";

export default function HomePage({
  pageInformation,
}: {
  pageInformation: any;
}) {
  return (
    <div style={{ width: "100%", height: "calc(100vh - 48px)", padding: 10 }}>
      <Row style={{ height: "100%" }}>
        <Col
          span={20}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Card
            title="Doanh thu hôm nay"
            style={{ width: "100%", height: "15%" }}
          >
            <Row>
              <Col span={12} style={{ fontSize: 20 }}>
                <ContainerFilled /> Đơn hàng: <strong>10</strong>
              </Col>
              <Col span={12} style={{ fontSize: 20 }}>
                <AccountBookFilled /> Doanh thu: <strong>1000000</strong>
              </Col>
            </Row>
          </Card>
          <Card
            title="Thống kê doanh thu"
            extra={
              <DatePicker.RangePicker
                defaultValue={[dayjs().subtract(7, "day"), dayjs()]}
              />
            }
            style={{ width: "100%", height: "85%" }}
          ></Card>
        </Col>
        <Col
          span={4}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Card
            title={
              <div
                style={{
                  position: "sticky",
                  top: 0,
                }}
              >
                Hoạt động gần đây
              </div>
            }
            style={{
              width: "100%",
              height: "100%",
            }}
          ></Card>
        </Col>
      </Row>
    </div>
  );
}
