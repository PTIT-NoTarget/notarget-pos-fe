import api from "@/services/interceptors/interceptors";

export const AuthService = {
  signIn(request: any) {
    return api.post(`auth/sign-in`, request);
  },
  signInWithOtp(request: any) {
    return api.post(`auth/sign-in-with-otp`, request);
  },
  removeOtp(request: any) {
    return api.post(`auth/remove-otp`, request);
  },
  profile() {
    return api.get(`auth/profile`);
  },
};
