import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { login, signUp, check, refreshAccessToken } from "../../api/auth";

export const useAuth = (redirectUrl?: string) => {
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    check()
      .then(({ user }) => {
        setUser(user);
      })
      .catch(async () => {
        try {
          const accessToken = await refreshAccessToken();
          localStorage.setItem("access_token", accessToken);
          const { user } = await check();
          setUser(user);
        } catch (error) {
          if (redirectUrl) {
            history.push(redirectUrl);
          }
        }
      });
  }, [history, redirectUrl]);

  return { user };
};

export const useLogin = () => {
  const { register, handleSubmit, errors, clearErrors, setError } = useForm();
  const history = useHistory();

  const onSubmit = async (data: any) => {
    try {
      clearErrors();
      const { accessToken } = await login(data);
      localStorage.setItem("access_token", accessToken);
      history.push("/chat");
    } catch (error) {
      if (error.response) {
        const {
          status,
          data: { message, errors },
        } = error.response;
        if (message === "Email not found") {
          setError("email", {
            type: "manual",
            message: message.toLowerCase(),
          });
        } else if (status === 400 && errors.length > 0) {
          errors.forEach((errorMessage: string) => {
            const field = errorMessage.split(" ")[0];
            setError(field, {
              type: "manual",
              message: errorMessage,
            });
          });
        } else if (status === 401) {
          setError("password", {
            type: "manual",
            message: "password doesn't match email",
          });
        }
      }
    }
  };

  return { register, onSubmit: handleSubmit(onSubmit), errors };
};

export const useSignUp = () => {
  const { register, handleSubmit, errors, clearErrors, setError } = useForm();
  const history = useHistory();

  const onSubmit = async (data: any) => {
    try {
      clearErrors();
      const { accessToken } = await signUp(data);
      localStorage.setItem("access_token", accessToken);
      history.push("/chat");
    } catch (error) {
      if (error.response) {
        const {
          status,
          data: { message, errors },
        } = error.response;
        if (message === "Email is in use") {
          setError("email", {
            type: "manual",
            message: message.toLowerCase(),
          });
        } else if (status === 400 && errors.length > 0) {
          errors.forEach((errorMessage: string) => {
            const field = errorMessage.split(" ")[0];
            setError(field, {
              type: "manual",
              message: errorMessage,
            });
          });
        }
      }
    }
  };

  return { register, onSubmit: handleSubmit(onSubmit), errors };
};
