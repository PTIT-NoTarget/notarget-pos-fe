import api from '@/services/interceptors'

export const OrderService = {
  search (viewName: string, filter: any) {
    return api.post(
      `order/search/${viewName}`,
      filter
    )
  },

  delete(id: string) {
    return api.delete(`order/${id}`)
  },

  deleteMulti(ids: any) {
    return api.delete(`order/multi`, {
      data: ids,
    })
  },

  get (id: string) {
    return api.get(`order/${id}`)
  },

  getByCode (code: string) {
    return api.get(`order/code/${code}`)
  },

  save (data: any) {
    return api.post(
      `order/save`,
      data
    )
  },

  create (data: any) {
    return api.post(
      `order/create`,
      data
    )
  },
}
