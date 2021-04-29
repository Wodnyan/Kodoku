import axios from "axios";
import { useEffect, useState } from "react";
import { API_ENDPOINT } from "../../../constants";
import { Server } from "../../../types";

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
        setServers(data.servers);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    })();
  }, []);

  return [servers, { isLoading }];
};
