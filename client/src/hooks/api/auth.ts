import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { signUp } from "../../api/auth";

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
            console.log(error);
          });
        }
      }
    }
  };

  return { register, onSubmit: handleSubmit(onSubmit), errors };
};
