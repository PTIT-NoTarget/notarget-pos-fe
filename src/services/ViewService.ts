import api from '@/services/interceptors'

export const viewService = {
  getViewByViewName (viewName: string) {
    return api.get(`view/${viewName}`)
  },

  getViewByMultiViewName (viewNames: string[]) {
    return api.post(`view/multi`, viewNames)
  }
}


