import api from '@/services/interceptors'

export const ImageService = {
  uploadImage (file: any, folder: string = '') {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(`image/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      params: {
        folder: folder,
      }
    })
  },
}


