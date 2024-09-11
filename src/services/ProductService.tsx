import axios from "axios";

export const searchProduct = (viewName: string, filter: any) => {
  return axios.post(
    `${process.env.REACT_APP_API_URL}/api/v1/product/search/${viewName}`,
    filter
  );
};

export const deleteProduct = (id: string) => {
  return axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/product/${id}`);
};

export const deleteMultiProduct = (ids: any) => {
  return axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/product/multi`, {
    data: { ids: ids },
  });
};

export const getProduct = (id: string) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/api/v1/product/${id}`);
};

export const saveProduct = (data: any) => {
  return axios.post(
    `${process.env.REACT_APP_API_URL}/api/v1/product/save`,
    data
  );
};

export const searchProductType = (viewName: string, filter: any) => {
  return axios.post(
    `${process.env.REACT_APP_API_URL}/api/v1/product/product-type/search/${viewName}`,
    filter
  );
};

export const deleteProductType = (id: string) => {
  return axios.delete(
    `${process.env.REACT_APP_API_URL}/api/v1/product/product-type/${id}`
  );
};

export const saveProductType = (data: any) => {
  return axios.post(
    `${process.env.REACT_APP_API_URL}/api/v1/product/product-type/save`,
    data
  );
};
