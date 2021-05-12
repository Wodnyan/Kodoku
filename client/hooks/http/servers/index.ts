import axios from "axios";
import { useEffect, useState } from "react";
import { API_ENDPOINT } from "../../../constants";
import { useAuth } from "../../../context/auth/AuthProvider";
import { Server } from "../../../types";

type CreateServerPayload = {
  name: string;
};

type CreateServerError = {
  error: string;
};

export const useCreateServer = (): [
  (payload: CreateServerPayload) => Promise<Server>,
  { isLoading: boolean; error: CreateServerError }
] => {
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<CreateServerError>({ error: null });

  async function request(payload: CreateServerPayload) {
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${API_ENDPOINT}/servers`, payload, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return data.server as Server;
    } catch (error) {
      setTimeout(() => {
        setIsLoading(false);
        setError({
          error: error.response.data.message.toLowerCase(),
        });
      }, 1000);
    }
  }

  return [request, { isLoading, error }];
};

export const useGetOneServer = (id: number) => {
  const [server, setServer] = useState<null | Server>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`${API_ENDPOINT}/servers/${id}`);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    })();
  }, []);

  return [server, { isLoading }];
};

export const useGetAllServers = (): [[] | Server[], { isLoading: boolean }] => {
  const { user } = useAuth();
  const [servers, setServers] = useState<[] | Server[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    if (user !== null) {
      (async () => {
        try {
          const { data } = await axios.get(
            `${API_ENDPOINT}/users/${user.id}/servers`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          setServers(data.servers);
        } catch (error) {
          console.log(error);
        }
        setIsLoading(false);
      })();
    }
  }, [user]);

  return [servers, { isLoading }];
};
