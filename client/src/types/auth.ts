// src/types/auth.ts

import type { User } from "./user";

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpResponse {
  success: boolean;
  message?: string;
  data: {
    token: string;
    user: User;
  };
}

export interface SignInResponse {
  success: boolean;
  message?: string;
  data: {
    token: string;
    user: User;
  };
}
