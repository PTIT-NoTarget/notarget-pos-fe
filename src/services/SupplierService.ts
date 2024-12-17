import api from "@/services/interceptors/interceptors";

export const SupplierService = {
  search(viewName: string, filter: any) {
    return api.post(`supplier/search/${viewName}`, filter);
  },

  delete(id: string) {
    return api.delete(`supplier/${id}`);
  },

  deleteMulti(ids: any) {
    return api.delete(`supplier/multi`, {
      data: ids,
    });
  },

  get(id: string) {
    return api.get(`supplier/${id}`);
  },

  getByCode(code: string) {
    return api.get(`supplier/code/${code}`);
  },

  save(data: any) {
    return api.post(`supplier/save`, data);
  },
};
