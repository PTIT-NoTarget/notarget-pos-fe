import api from "@/services/interceptors/interceptors";

export const ExcelService = {
  getExcelTemplate(viewName: string) {
    return api.get(`excel/template/${viewName}`, { responseType: "blob" });
  },
  exportExcel(viewName: string) {
    return api.get(`excel/export/${viewName}`, { responseType: "blob" });
  },
  importExcel(viewName: string, file: any) {
    const formData = new FormData();
    formData.append("file", file);
    return api.post(`excel/import/${viewName}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
