import { API_ENDPOINT } from "../constants";

const MEMBERS_ENPOINT = `${API_ENDPOINT}/member`;

export async function getAllMembers(serverId: number) {
  const resp = await fetch(`${MEMBERS_ENPOINT}`);
  return resp;
}
