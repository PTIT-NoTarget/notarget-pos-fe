import api from '@/services/interceptors'

export const ViewService = {
  getViewByViewName (viewName: string) {
    return api.get(`view/${viewName}`)
  },

  getViewByMultiViewName (viewNames: string[]) {
    return api.post(`view/multi`, viewNames)
  }
}


