import React, { useEffect, useState } from "react";
import OAuthButton from "../../components/OAuthButton";
import Line from "../../components/Line";
import { API_ENDPOINT } from "../../constants";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

interface Inputs {
  email: string;
  password: string;
  username: string;
}

const Signup = () => {
  const {
    register,
    handleSubmit,
    errors,
    setError,
    clearErrors,
  } = useForm<Inputs>();
  const [showPassword, setShowPassword] = useState(false);
  const history = useHistory();
  useEffect(() => {
    document.title = "Sign up";
  }, []);
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  const onSubmit = async (data: any) => {
    clearErrors();
    const resp = await fetch(`${API_ENDPOINT}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (resp.ok) {
      const user = await resp.json();
      history.push("/chat");
    } else {
      const error = await resp.json();
      if (error.code === 409) {
        setError("email", { type: "required", message: "email is in use" });
      } else {
        error.errors?.forEach((error: any) => {
          setError(error.split(" ")[0], {
            type: "required",
            message: error,
          });
        });
      }
      // setError("email", { type: "required", message: error.message });
    }
  };
  return (
    <main className="flex flex-col justify-center items-center h-full">
      <div className="w-1/3">
        <h1 className="text-center text-4xl mb-4">Sign up to Kodoku</h1>
        <OAuthButton
          icon="/github.svg"
          location={`${API_ENDPOINT}/auth/github`}
        >
          Sign in with Github
        </OAuthButton>
        <div className="flex justify-between items-center my-4">
          <Line />
          <div className="mx-2">or</div>
          <Line />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="font-bold">
              Email Address
            </label>
            <input
              id="email"
              type="text"
              name="email"
              ref={register({ required: true })}
              className={`input ${errors.email && "input--error"}`}
            />
            {errors.email && (
              <p className="error-message">
                {errors.email.message?.length === 0
                  ? "This field is required"
                  : errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="username" className="font-bold">
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              ref={register({ required: true })}
              className={`input ${errors.username && "input--error"}`}
            />
            {errors.username && (
              <p className="error-message">
                {errors.username.message?.length === 0
                  ? "This field is required"
                  : errors.username.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="font-bold">
              Password
            </label>
            <div
              className={`flex input input--password ${
                errors.password && "input--error"
              }`}
            >
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                ref={register({ required: true })}
                className="w-full p-1"
              />
              <button
                className="min-w-32 focus:outline-none"
                // If this isn't set explicitly than it be a type "submit".
                type="button"
                onClick={toggleShowPassword}
              >
                {showPassword ? "hide" : "show"}
              </button>
            </div>
            {errors.password && (
              <p className="error-message">
                {errors.password.message?.length === 0
                  ? "This field is required"
                  : errors.password.message}
              </p>
            )}
          </div>
          <div className="flex justify-between">
            <div className="">
              <span>Already have an account? </span>
              <Link to="/auth/login" className="link">
                Login!
              </Link>
            </div>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </main>
  );
};
export default Signup;
