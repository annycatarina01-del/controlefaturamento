export interface User {
  id: string;
  email: string;
  user_metadata?: {
    nome?: string;
    empresa?: string;
    celular?: string;
    approved?: boolean;
    paused?: boolean;
    role?: "admin" | "user";
  };
}

export interface SignUpData {
  email: string;
  password: string;
  nome: string;
  empresa: string;
  celular: string;
}

export interface AuthResponse {
  user: User | null;
  error: string | null;
}
