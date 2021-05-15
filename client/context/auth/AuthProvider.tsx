import axios from "axios";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { API_ENDPOINT } from "../../constants";
import { User } from "../../types";

type authContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
  error: string;
};

const authContextDefaultValues: authContextType = {
  user: null,
  isLoading: false,
  login: () => {},
  logout: () => {},
  error: "",
};

const AuthContext = createContext<authContextType>(authContextDefaultValues);

type Options = {
  redirectTo?: string;
};

export function useAuth(options?: Options) {
  const router = useRouter();
  const { user, isLoading, logout, login, error } = useContext(AuthContext);

  useEffect(() => {
    if (options?.redirectTo && !isLoading && user === null && error !== "") {
      router.push(options.redirectTo);
    }
  }, [isLoading, user, error]);

  return {
    user,
    isLoading,
    logout,
    login,
    error,
  };
}

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<null | User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Every 5 minutes refresh the access token
  useEffect(() => {
    async function refreshAccessToken() {
      setIsLoading(true);
      try {
        const {
          data: { accessToken },
        } = await axios.get(`${API_ENDPOINT}/access-token/refresh`, {
          withCredentials: true,
        });
        localStorage.setItem("accessToken", accessToken);
        setIsLoading(false);
      } catch (error) {
        logout();
        setIsLoading(false);
        setError(error.response?.data?.message);
      }
    }
    refreshAccessToken();
    setTimeout(refreshAccessToken, 300000);
    return () => {};
  }, []);

  // On mount make request to get user info
  useEffect(() => {
    setIsLoading(true);
    (async () => {
      try {
        const { data } = await axios.get(`${API_ENDPOINT}/auth/check`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        login(data.user);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError(error.response?.data?.message);
      }
    })();
    return () => {};
  }, []);

  function login(user: User) {
    setUser(user);
  }
  function logout() {
    setUser(null);
  }
  const value = {
    user,
    login,
    logout,
    isLoading,
    error,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
