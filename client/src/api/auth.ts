import { API_ENDPOINT } from "../constants";
import axios from "axios";

interface LoginCredentials {
  username: string;
  email: string;
  password: string;
}

const AUTH_ENDPOINT = `${API_ENDPOINT}/auth`;

export const login = async (userCredentials: LoginCredentials) => {
  const { data } = await axios.post(
    `${AUTH_ENDPOINT}/register`,
    userCredentials,
    {
      withCredentials: true,
    }
  );
  return data;
};
