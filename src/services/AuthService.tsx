import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role: string;
  [key: string]: any;
}

export const signIn = (data: any) => {
  return axios.post(
    `${process.env.REACT_APP_API_URL}/api/v1/auth/sign-in`,
    data
  );
};

export const signUp = (data: any) => {
  return axios.post(
    `${process.env.REACT_APP_API_URL}/api/v1/auth/sign-up`,
    data
  );
};

export const refreshToken = () => {
  return axios.post(`${process.env.REACT_APP_API_URL}/api/v1/auth/refresh`, {
    refresh_token: localStorage.getItem("refresh_token"),
  });
};

export const isValidToken = (token: string) => {
  return axios.post(
    `${process.env.REACT_APP_API_URL}/api/v1/auth/is-token-valid`,
    {
      token: token,
    }
  );
};

export const checkRole = (role: string) => {
  try {
    let token: string = localStorage.getItem("access_token") || "";
    const decodedToken = jwtDecode<DecodedToken>(token);
    return decodedToken.role === role;
  } catch (error) {
    console.error("Invalid token", error);
    return false;
  }
};
