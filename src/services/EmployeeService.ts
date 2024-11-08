import api from '@/services/interceptors/interceptors'

export const EmployeeService = {
  search (viewName: string, filter: any) {
    return api.post(
      `employee/search/${viewName}`,
      filter
    )
  },

  delete(id: string) {
    return api.delete(`employee/${id}`)
  },

  deleteMulti(ids: any) {
    return api.delete(`employee/multi`, {
      data: ids,
    })
  },

  get (id: string) {
    return api.get(`employee/${id}`)
  },

  getByCode (code: string) {
    return api.get(`employee/code/${code}`)
  },

  save (data: any) {
    return api.post(
      `employee/save`,
      data
    )
  },
}
