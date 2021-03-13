export interface Message {
  id: number;
  sender: string;
  body: string;
  createdAt: string;
}
export interface User {
  id: number;
  username: string;
  email: string;
  avatarUrl: string | null;
}

export interface Server {
  id: number;
  name: string;
  icon: string;
  user?: User;
}

export interface Room {
  id: number;
  name: string;
}
