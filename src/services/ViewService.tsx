import axios from "axios";
import { DataType } from "../utils/Constant";
import { Avatar, Input, TableColumnType, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import formatNumber from "../utils/NumberUtils";

export const getViewByViewName = (viewName: string) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/api/v1/view/${viewName}`);
};

export const getViewByMultiViewName = (viewName: string[]) => {
  return axios.post(
    `${process.env.REACT_APP_API_URL}/api/v1/view/multi`,
    viewName
  );
};

const getColumnProps = (
  view: any,
  filter: any,
  setFilter: any
): TableColumnType<any> => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys }) => (
    <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
      <Input.Search
        placeholder={`Tìm kiếm ${view["key_title"]}`}
        value={selectedKeys[0]}
        onChange={(e) => {
          setSelectedKeys(e.target.value ? [e.target.value] : []);
        }}
        onSearch={(e) => {
          setFilter({
            ...filter,
            filter: {
              ...filter.filter,
              [view["key_name"]]: {
                ...filter.filter[view["key_name"]],
                value: selectedKeys[0],
                operator: "like",
              },
            },
          });
        }}
        style={{ display: "block" }}
      />
    </div>
  ),
  filterIcon: () => <SearchOutlined style={{ marginRight: 8 }} />,
  onFilter: (value, record) => true,
  showSorterTooltip: false,
});

export const checkViewToShow = (view: any, filter: any, setFilter: any) => {
  let result: any = [];
  for (let i = 0; i < view.length; i++) {
    let column: any = {};
    switch (view[i]["data_type"]) {
      case DataType.STRING:
      case DataType.LONG_STRING:
        column = {
          key: view[i]["index"],
          title: view[i]["key_title"],
          width: view[i]["width"],
          dataIndex: view[i]["key_name"],
          fixed:
            view[i]["is_fixed"] === 0
              ? false
              : view[i]["is_fixed"] === -1
              ? "left"
              : "right",
          ellipsis: true,
          render: (text: string) => <Tooltip title={text}>{text}</Tooltip>,
          ...getColumnProps(view[i], filter, setFilter),
          sorter: true,
          sortDirections: ["descend", "ascend"],
        };
        break;
      case DataType.INTEGER:
      case DataType.LONG:
      case DataType.DOUBLE:
        column = {
          key: view[i]["index"],
          title: view[i]["key_title"],
          width: view[i]["width"],
          dataIndex: view[i]["key_name"],
          fixed:
            view[i]["is_fixed"] === 0
              ? false
              : view[i]["is_fixed"] === -1
              ? "left"
              : "right",
          ellipsis: true,
          render: (text: number) => {
            let number: string = formatNumber(text);
            return <Tooltip title={number}>{number}</Tooltip>;
          },
          ...getColumnProps(view[i], filter, setFilter),
          sorter: true,
          sortDirections: ["descend", "ascend"],
        };
        break;
      case DataType.IMAGE:
        column = {
          key: view[i]["index"],
          title: view[i]["key_title"],
          width: view[i]["width"],
          dataIndex: view[i]["key_name"],
          fixed:
            view[i]["is_fixed"] === 0
              ? false
              : view[i]["is_fixed"] === -1
              ? "left"
              : "right",
          render: (text: string) => {
            return <Avatar src={text} />;
          },
        };
        break;
      case DataType.RELATION:
        column = {
          key: view[i]["index"],
          title: view[i]["key_title"],
          width: view[i]["width"],
          dataIndex: view[i]["relate_table"],
          fixed:
            view[i]["is_fixed"] === 0
              ? false
              : view[i]["is_fixed"] === -1
              ? "left"
              : "right",
          ellipsis: true,
          render: (text: any) => {
            return (
              <Tooltip title={text ? [view[i]["relate_column"]] : ""}>
                {text ? text[view[i]["relate_column"]] : ""}
              </Tooltip>
            );
          },
          ...getColumnProps(view[i], filter, setFilter),
        };
        break;
    }
    result.push(column);
  }
  return result;
};
