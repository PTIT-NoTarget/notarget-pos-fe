import axios from "axios"

export const getInformationByPage = (page: string) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/api/v1/information/${page}`)
}