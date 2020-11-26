export interface Message {
  id: number;
  sender: string;
  body: string;
}
export interface User {
  id: number;
  username: string;
  email: string;
  avatar_url?: string;
}

export interface Server {
  id: number;
  name: string;
  icon: string;
}
