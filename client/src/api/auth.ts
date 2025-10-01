// src/api/auth.ts
import client from "./client";
import {
  type SignUpResponse,
  type SignUpPayload,
  type SignInPayload,
  type SignInResponse,
} from "../types/auth";

export const signUp = async (
  payload: SignUpPayload
): Promise<SignUpResponse> => {
  const res = await client.post<SignUpResponse>("/auth/sign-up", payload);
  return res.data;
};

export const signIn = async (
  payload: SignInPayload
): Promise<SignInResponse> => {
  const res = await client.post<SignInResponse>("/auth/sign-in", payload);
  return res.data;
};
