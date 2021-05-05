import axios from "axios";
import { useEffect, useState } from "react";
import { API_ENDPOINT } from "../../../constants";
import { useAuth } from "../../../context/auth/AuthProvider";
import { Server } from "../../../types";

type CreateServerPayload = {
  name: string;
};

export const useCreateServer = (): [
  (payload: CreateServerPayload) => Promise<Server>,
  { isLoading: boolean },
] => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  console.log(user);

  async function request(payload: CreateServerPayload) {
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${API_ENDPOINT}/servers`, payload, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setIsLoading(false);
      return data.server as Server;
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  }

  return [request, { isLoading }];
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
  const [servers, setServers] = useState<[] | Server[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`${API_ENDPOINT}/servers`);
        console.log(data);
        setServers(data.servers);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    })();
  }, []);

  return [servers, { isLoading }];
};
