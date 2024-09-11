import NotFoundPage from "./NotFoundPage";
import SignInPage from "../../auth/pages/SignInPage";
import SignUpPage from "../../auth/pages/SignUpPage";
import HomePage from "../../home/pages/HomePage";
import ProductListPage from "../../product/pages/ProductListPage";
import ProductEntryPage from "../../product/pages/ProductEntryPage";
import ProductExportPage from "../../product/pages/ProductExportPage";
import CustomerPage from "../../customer/pages/CustomerPage";
import EmployeePage from "../../employee/pages/EmployeePage";
import SellPage from "../../sell/pages/SellPage";
import PrintPage from "../../setting/pages/PrintPage";

export const routes = [
  {
    path: "/sign-in",
    component: SignInPage,
    exact: true,
    pageInformationKey: "sign_in",
    hasHeader: false,
  },
  {
    path: "/sign-up",
    component: SignUpPage,
    exact: true,
    pageInformationKey: "sign_up",
    hasHeader: false,
  },
  {
    path: "/home",
    component: HomePage,
    exact: true,
    pageInformationKey: "home",
    hasHeader: true,
  },
  {
    path: "/product",
    component: ProductListPage,
    exact: true,
    pageInformationKey: "product_list",
    hasHeader: true,
  },
  {
    path: "/product/list-product",
    component: ProductListPage,
    exact: true,
    pageInformationKey: "product_list",
    hasHeader: true,
  },
  {
    path: "/product/import",
    component: ProductEntryPage,
    exact: true,
    pageInformationKey: "product_entry",
    hasHeader: true,
  },
  {
    path: "/product/export",
    component: ProductExportPage,
    exact: true,
    pageInformationKey: "product_export",
    hasHeader: true,
  },
  {
    path: "/customer",
    component: CustomerPage,
    exact: true,
    pageInformationKey: "customer",
    hasHeader: true,
  },
  {
    path: "/employee",
    component: EmployeePage,
    exact: true,
    pageInformationKey: "employee",
    hasHeader: true,
  },
  {
    path: "/sell",
    component: SellPage,
    exact: true,
    pageInformationKey: "sell",
    hasHeader: true,
  },
  {
    path: "/setting",
    component: PrintPage,
    exact: true,
    pageInformationKey: "print",
    hasHeader: true,
  },
  {
    path: "/setting/print",
    component: PrintPage,
    exact: true,
    pageInformationKey: "print",
    hasHeader: true,
  },
  {
    path: "*",
    component: NotFoundPage,
    exact: true,
    pageInformationKey: "not_found",
    hasHeader: true,
  },
];
