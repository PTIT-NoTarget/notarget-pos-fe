import api from '@/services/interceptors'

export const productService = {
  searchProduct (viewName: string, filter: any) {
    return api.post(
      `product/search/${viewName}`,
      filter
    )
  },

  deleteProduct (id: string) {
    return api.delete(`product/${id}`)
  },

  deleteMultiProduct (ids: any) {
    return api.delete(`product/multi`, {
      data: { ids: ids },
    })
  },

  getProduct (id: string) {
    return api.get(`product/${id}`)
  },

  saveProduct (data: any) {
    return api.post(
      `product/save`,
      data
    )
  },

  searchProductType (viewName: string, filter: any) {
    return api.post(
      `product/product-type/search/${viewName}`,
      filter
    )
  },

  deleteProductType (id: string) {
    return api.delete(
      `product/product-type/${id}`
    )
  },

  saveProductType (data: any) {
    return api.post(
      `product/product-type/save`,
      data
    )
  },
}
