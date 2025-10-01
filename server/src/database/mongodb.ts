import mongoose from "mongoose";
import { envVariables } from "../config/env";

const connetToDatabase = async () => {
  try {
    if (!envVariables.dbUri) {
      throw new Error(
        "Please define a MONGODB_URI inside .env.<development/production>.local"
      );
    }
    await mongoose.connect(envVariables.dbUri);
    console.log(`Connected to databse in ${envVariables.nodeEnv} mode`);
  } catch (error) {
    console.error("Error connecting to database: ", error);
    process.exit(1);
  }
};

export default connetToDatabase;