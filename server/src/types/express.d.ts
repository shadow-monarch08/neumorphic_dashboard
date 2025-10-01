import mongoose from "mongoose";
import { UserType } from "./user";

declare global {
  namespace Express {
    interface Request {
      user: UserType;
    }
  }
}

export {};
