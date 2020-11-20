import React, { useEffect } from "react";
import OAuthButton from "../../components/OAuthButton";
import { API_ENDPOINT } from "../../constants";

const Login = () => {
  useEffect(() => {
    document.title = "Login";
  }, []);
  return (
    <main>
      <h1>Login</h1>
      <form>
        <div>
          <label htmlFor="email" className="font-bold">
            Email Address
          </label>
          <input
            id="email"
            type="text"
            className="block w-full border-black border-2 border-solid mb-2 p-1"
          />
        </div>
        <div>
          <label htmlFor="password" className="font-bold">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="block w-full border-black border-2 border-solid mb-2 p-1"
          />
        </div>
      </form>
      <OAuthButton icon="/github.svg" location={`${API_ENDPOINT}/auth/github`}>
        Sign in with Github
      </OAuthButton>
    </main>
  );
};
export default Login;
