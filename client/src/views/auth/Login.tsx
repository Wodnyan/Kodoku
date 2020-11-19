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
      <OAuthButton icon="/github.svg" location={`${API_ENDPOINT}/auth/github`}>
        Sign in with Github
      </OAuthButton>
    </main>
  );
};
export default Login;
