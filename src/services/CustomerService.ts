import api from "@/services/interceptors/interceptors";

export const CustomerService = {
  search(viewName: string, filter: any) {
    return api.post(`customer/search/${viewName}`, filter);
  },

  delete(id: string) {
    return api.delete(`customer/${id}`);
  },

  deleteMulti(ids: any) {
    return api.delete(`customer/multi`, {
      data: ids,
    });
  },

  get(id: string) {
    return api.get(`customer/${id}`);
  },

  getByCode(code: string) {
    return api.get(`customer/code/${code}`);
  },

  save(data: any) {
    return api.post(`customer/save`, data);
  },
};
