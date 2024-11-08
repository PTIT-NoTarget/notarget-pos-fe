import {jwtDecode} from "jwt-decode";

export const TokenUtils = {
  getDataFromToken(): any {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return null;
    return jwtDecode(accessToken);
  },
  getCurrentUser(): any {
    const data = this.getDataFromToken();
    if (!data) return null;
    return data.sub;
  },
  getCurrenUserRole(): any {
    const data = this.getDataFromToken();
    if (!data) return null;
    return data.role;
  },
  checkOtp(): boolean {
    const data = this.getDataFromToken();
    if (!data) return false;
    return data.otp;
  }
}
