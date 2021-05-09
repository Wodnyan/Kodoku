import { useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../../../constants";
import { mapValidationErrorArrayToObject } from "../../../utils/mapValidationErrorArrayToObject";
import { useAuth } from "../../../context/auth/AuthProvider";

interface Credentials {
  password: string;
  email: string;
}

export const useLogin = () => {
  const { login: addUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Credentials>>({
    password: null,
    email: null,
  });

  async function login(credentials: Credentials) {
    setErrors(null);
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        `${API_ENDPOINT}/auth/login`,
        credentials,
        {
          withCredentials: true,
        }
      );
      localStorage.setItem("accessToken", data.accessToken);
      addUser(data.user);
      setTimeout(() => setIsLoading(false), 1000);
      return true;
    } catch (error) {
      let validationErrors = null;
      // Server Validation Error
      if (error.response.status === 400) {
        const errors = mapValidationErrorArrayToObject(
          error.response.data.errors,
          ["email", "password"]
        );
        validationErrors = errors;
      } else if (error.response.status === 401) {
        const errors = mapValidationErrorArrayToObject(
          [error.response.data.message.toLowerCase()],
          ["email", "password"]
        );
        validationErrors = errors;
      }
      setTimeout(() => {
        setIsLoading(false);
        setErrors(validationErrors);
      }, 1000);
      return false;
    }
  }

  return {
    login,
    isLoading,
    errors,
  };
};
