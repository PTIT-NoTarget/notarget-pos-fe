import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, Dropdown, Layout, Menu, MenuProps, Typography } from "antd";
import {
  PieChartOutlined,
  ProductFilled,
  FolderOutlined,
  ImportOutlined,
  ExportOutlined,
  ShopOutlined,
  UserOutlined,
  DownOutlined,
  ShoppingCartOutlined,
  UserSwitchOutlined,
  TeamOutlined,
  SettingOutlined,
  PrinterOutlined,
} from "@ant-design/icons";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const leftMenuItems: MenuItem[] = [
  getItem("Tổng quan", "/home", <PieChartOutlined />),
  getItem("Hàng hóa", "/product", <ProductFilled />, [
    getItem("Danh sách hàng hóa", "/product/list-product", <FolderOutlined />),
    getItem("Nhập hàng", "/product/import", <ImportOutlined />),
    getItem("Xuất hàng", "/product/export", <ExportOutlined />),
  ]),
  getItem("Khách hàng", "/customer", <UserSwitchOutlined />),
  getItem("Nhân viên", "/employee", <TeamOutlined />),
];

const rightMenuItems: MenuItem[] = [
  getItem("Bán hàng", "/sell", <ShoppingCartOutlined />),
  getItem("Cài đăt", "/setting", <SettingOutlined />, [
    getItem("Tem in", "/setting/print", <PrinterOutlined />),
  ]),
  getItem(
    "",
    "/account",
    <div>
      <Avatar size={48} icon={<UserOutlined />} />
      <DownOutlined />
    </div>,
    [
      getItem("Thông tin cá nhân", "/account/profile"),
      getItem("Đăng xuất", "/account/logout"),
    ]
  ),
];

const findMenuItemKey: any = (items: any, path: React.Key) => {
  for (const item of items) {
    if (item.key === path) {
      return item.label;
    }
    if (item.children) {
      const childKey = findMenuItemKey(item.children, path);
      if (childKey) {
        return childKey;
      }
    }
  }
  return null;
};

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [current, setCurrent] = useState<string>(location.pathname);
  const onClickMenu: MenuProps["onClick"] = (e) => {
    if (e.key === "/account/logout") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      navigate("/sign-in");
    }
    navigate(e.key as string);
    setCurrent(e.key as string);
  };

  useEffect(() => {
    setCurrent(location.pathname);
    document.title =
      findMenuItemKey(
        [...leftMenuItems, ...rightMenuItems],
        location.pathname
      ) || "Tổng quan";
  }, [location]);

  return (
    <Layout.Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", width: "70%" }}>
        <ShopOutlined
          style={{ fontSize: "24px", color: "white", marginRight: "10px" }}
        />
        <Menu
          onClick={onClickMenu}
          selectedKeys={[current]}
          theme="dark"
          mode="horizontal"
          items={leftMenuItems}
          style={{ width: "100%" }}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          width: "30%",
        }}
      >
        <Menu
          onClick={onClickMenu}
          selectedKeys={[current]}
          theme="dark"
          mode="horizontal"
          items={rightMenuItems}
          style={{ width: "100%", justifyContent: "flex-end" }}
        />
      </div>
    </Layout.Header>
  );
}
