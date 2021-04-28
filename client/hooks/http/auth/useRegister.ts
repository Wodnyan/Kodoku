import { useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../../../constants";
import { mapValidationErrorArrayToObject } from "../../../utils/mapValidationErrorArrayToObject";

interface Credentials {
  username: string;
  password: string;
  email: string;
}

export const useRegister = () => {
  // TODO: Write validation
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Credentials>>({
    username: null,
    password: null,
    email: null,
  });

  async function register(credentials: Credentials) {
    setErrors(null);
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        `${API_ENDPOINT}/auth/register`,
        credentials,
        {
          withCredentials: true,
        },
      );
      console.log(data);
      setTimeout(() => setIsLoading(false), 1000);
      return true;
    } catch (error) {
      let validationErrors = null;
      // Server Validation Error
      if (error.response.status === 400) {
        const errors = mapValidationErrorArrayToObject(
          error.response.data.errors,
          ["username", "password", "email"],
        );
        validationErrors = errors;
        // Existing email
      } else if (error.response.status === 409) {
        const errors = mapValidationErrorArrayToObject(
          [error.response.data.message],
          ["email"],
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
    register,
    isLoading,
    errors,
  };
};
