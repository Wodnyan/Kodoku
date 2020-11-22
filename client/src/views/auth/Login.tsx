import React, { useEffect, useState } from "react";
import OAuthButton from "../../components/OAuthButton";
import Line from "../../components/Line";
import { API_ENDPOINT } from "../../constants";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

interface Inputs {
  email: string;
  password: string;
  server: string;
}

interface Error {
  message: string;
  type?: string;
}

const Login = () => {
  const { register, handleSubmit, errors } = useForm<Inputs>();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<null | Error>(null);
  const history = useHistory();
  useEffect(() => {
    document.title = "Login";
  }, []);
  const onSubmit = async (data: any) => {
    const resp = await fetch(`${API_ENDPOINT}/auth/login`, {
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
      setServerError({ message: "Invalid login attempt" });
    }
  };
  return (
    <main className="flex flex-col justify-center items-center h-full">
      <div className="w-1/3">
        <h1 className="text-center text-4xl mb-4">Login to Kodoku</h1>
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
              <p className="error-message">This field is required</p>
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
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "hide" : "show"}
              </button>
            </div>
            {errors.password && (
              <p className="error-message">This field is required</p>
            )}
          </div>
          {serverError && (
            <p className="error-message text-center text-xl">
              {serverError.message}
            </p>
          )}
          <div className="flex justify-between">
            <div className="">
              <span>Don't have an account? </span>
              <Link to="/auth/signup" className="link">
                Create One!
              </Link>
            </div>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </main>
  );
};
export default Login;
