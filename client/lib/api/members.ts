import axios from "axios";
import { API_ENDPOINT } from "../../constants";

export async function fetchAllMembersOfServer(serverId: number) {
  const { data } = await axios.get(
    `${API_ENDPOINT}/servers/${serverId}/members`
  );
  return data.members;
}
