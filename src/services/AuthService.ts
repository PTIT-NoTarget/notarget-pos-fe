import api from '@/services/interceptors'

export const AuthService = {
  signIn (request: any) {
    return api.post(
      `auth/sign-in`,
      request
    )
  },
  signInWithOtp (request: any) {
    return api.post(
      `auth/sign-in-with-otp`,
      request
    )
  }
}
