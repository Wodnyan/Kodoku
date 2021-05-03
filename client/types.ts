export type AuthenticationToken = "accessToken" | "refreshToken";

export interface Server {
  id: number;
  name: string;
  icon: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

export interface Room {
  id: number;
  name: string;
}
