export type AuthenticationToken = "accessToken" | "refreshToken";

export type Server = {
  id: number;
  name: string;
  icon: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  avatar?: string;
};

export type Room = {
  id: number;
  name: string;
};

export type Member = {
  id: number;
  username: string;
  createdAt: string;
};
