import api from "@/services/interceptors/interceptors";

export const ProductService = {
  searchProduct(viewName: string, filter: any) {
    return api.post(`product/search/${viewName}`, filter);
  },

  deleteProduct(id: string) {
    return api.delete(`product/${id}`);
  },

  deleteMultiProduct(ids: any) {
    return api.delete(`product/multi`, {
      data: ids,
    });
  },

  getProduct(id: string) {
    return api.get(`product/${id}`);
  },

  getProductByCode(code: string) {
    return api.get(`product/code/${code}`);
  },

  saveProduct(data: any) {
    return api.post(`product/save`, data);
  },

  searchProductType(viewName: string, filter: any) {
    return api.post(`product/product-type/search/${viewName}`, filter);
  },

  deleteProductType(id: string) {
    return api.delete(`product/product-type/${id}`);
  },

  saveProductType(data: any) {
    return api.post(`product/product-type/save`, data);
  },
};
