// src/api/auth.ts
import type { GetUserResponce } from "../types/user";
import client from "./client";

export const getUser = async (): Promise<GetUserResponce> => {
  const res = await client.get<GetUserResponce>(`/users`);
  return res.data;
};
