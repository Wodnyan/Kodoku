import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { API_ENDPOINT } from "../../constants";
import { User } from "../../types";

type authContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
};

const authContextDefaultValues: authContextType = {
  user: null,
  isLoading: false,
  login: () => {},
  logout: () => {},
};

const AuthContext = createContext<authContextType>(authContextDefaultValues);

export function useAuth() {
  return useContext(AuthContext);
}

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<null | User>(null);
  const [isLoading, setIsLoading] = useState(false);

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
        console.error(error);
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
        setUser(null);
        setIsLoading(false);
      }
    })();
    return () => {};
  }, []);

  function login(user: User) {
    setUser(user);
  }
  function logout() {
    console.log("logout");
    setUser(null);
  }
  const value = {
    user,
    login,
    logout,
    isLoading,
  };
  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  );
}
