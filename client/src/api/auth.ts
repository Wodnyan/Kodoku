import { API_ENDPOINT } from "../constants";
import axios from "axios";

interface LoginCredentials {
  username: string;
  email: string;
  password: string;
}

interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
}

const AUTH_ENDPOINT = `${API_ENDPOINT}/auth`;
const ACCESS_TOKEN_REFRESH_ENDPOINT = `${API_ENDPOINT}/access-token/refresh`;

export const login = async (userCredentials: LoginCredentials) => {
  const { data } = await axios.post(`${AUTH_ENDPOINT}/login`, userCredentials, {
    withCredentials: true,
  });
  return data;
};

export const signUp = async (userCredentials: SignUpCredentials) => {
  const { data } = await axios.post(
    `${AUTH_ENDPOINT}/register`,
    userCredentials,
    {
      withCredentials: true,
    }
  );
  return data;
};

export const check = async (accessToken?: string) => {
  const { data } = await axios.get(`${AUTH_ENDPOINT}/check`, {
    headers: {
      Authorization: `Bearer ${
        accessToken || localStorage.getItem("access_token")
      }`,
    },
    withCredentials: true,
  });
  return data;
};

export const refreshAccessToken = async () => {
  const {
    data: { accessToken },
  } = await axios.get(ACCESS_TOKEN_REFRESH_ENDPOINT, {
    withCredentials: true,
  });
  return accessToken;
};
