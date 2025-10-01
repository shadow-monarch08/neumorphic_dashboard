import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "User name is required"],
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: String,
      require: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      match: [/^[\w.-]+@[\w.-]+\.\w{2,}$/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      require: [true, "Password is required"],
      minLength: 6,
      select: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
