import api from '@/services/interceptors'
import axios from 'axios'

export const ViewService = {
  getViewByViewName (viewName: string) {
    return api.get(`view/${viewName}`)
  },

  getViewByMultiViewName (viewNames: string[]) {
    // return api.post(`view/multi`, viewNames)
    return axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/view/multi`, viewNames,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        }
      })
  }
}


