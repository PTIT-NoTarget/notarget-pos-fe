export const customer_type: any = {
  NEW: {
    value: "NEW",
    label: "Khách hàng mới",
  },
  POTENTIAL: {
    value: "POTENTIAL",
    label: "Khách hàng tiềm năng",
  },
  REGULAR: {
    value: "REGULAR",
    label: "Khách hàng thường xuyên",
  },
  LONG_TERM: {
    value: "LONG_TERM",
    label: "Khách hàng lâu dài",
  },
  VIP: {
    value: "VIP",
    label: "Khách hàng VIP",
  },
};

export const payment: any = {
  CASH: {
    value: "CASH",
    label: "Tiền mặt",
  },
  TRANSFER: {
    value: "TRANSFER",
    label: "Chuyển khoản",
  },
};

export const payment_status: any = {
  PENDING: {
    value: "PENDING",
    label: "Chờ xử lý",
  },
  PAID: {
    value: "PAID",
    label: "Đã thanh toán",
  },
  DEBT: {
    value: "DEBT",
    label: "Nợ",
  },
  CANCELLED: {
    value: "CANCELLED",
    label: "Đã hủy",
  },
};

export const revenue_report: any = {
  DAY: {
    value: "DAY",
    label: "Hôm nay",
  },
  WEEK: {
    value: "WEEK",
    label: "7 ngày gần nhất",
  },
  MONTH: {
    value: "MONTH",
    label: "1 tháng gần nhất",
  },
  THREE_MONTH: {
    value: "THREE_MONTH",
    label: "3 tháng gần nhất",
  },
};

export const Enum = {
  customer_type,
  payment,
  payment_status,
  revenue_report,
};
