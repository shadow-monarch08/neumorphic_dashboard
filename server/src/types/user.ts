import mongoose from "mongoose";

export interface UserType {
  _id: mongoose.Types.ObjectId;
  name?: string | null;
  email?: string | null;
  password?: string | null;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  __v: number;
}