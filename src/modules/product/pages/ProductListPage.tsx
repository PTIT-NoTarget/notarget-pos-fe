import { Col, Row } from "antd";
import FilterProductList from "../components/FilterProductList";
import TableProductList from "../components/TableProductList";
import { useState } from "react";

export default function ProductListPage({
  pageInformation,
}: {
  pageInformation: any;
}) {
  const [filter, setFilter] = useState<any>({
    page_number: 0,
    page_size: 20,
    filter: {},
    common: "",
    sort_property: "",
    sort_order: "",
  });
  return (
    <Row style={{ width: "100%", height: "calc(100vh - 48px)", padding: 10 }}>
      <Col span={4} style={{ height: "100%" }}>
        <FilterProductList filter={filter} setFilter={setFilter} />
      </Col>
      <Col span={20} style={{ height: "100%" }}>
        <TableProductList filter={filter} setFilter={setFilter} />
      </Col>
    </Row>
  );
}
