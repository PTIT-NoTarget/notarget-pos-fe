import axios from "axios";

export const getExcelTemplate = (viewName: string) => {
  return axios.get(
    `${process.env.REACT_APP_API_URL}/api/v1/excel/template/${viewName}`,
    { responseType: "blob" }
  );
};

export const exportExcel = (viewName: string) => {
  return axios.get(
    `${process.env.REACT_APP_API_URL}/api/v1/excel/export/${viewName}`,
    { responseType: "blob" }
  );
};

export const importExcel = (viewName: string, file: any) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post(
    `${process.env.REACT_APP_API_URL}/api/v1/excel/import/${viewName}`,
    formData
  );
};
