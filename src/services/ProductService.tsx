import axios from "axios"

export const getViewByViewName = (viewName: string) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/api/v1/view/${viewName}`)
}

export const getViewByMultiViewName = (viewName: string[]) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/api/v1/view/multi`, viewName)
}