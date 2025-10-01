import { config } from "dotenv";

config({path: `.env.${process.env.NODE_ENV || 'development'}.local`})

export const envVariables = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV || "development",
  dbUri: process.env.DB_URI!,
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpiresIn: Number(process.env.JWT_EXPIRES_IN),
  arcJetKey: process.env.ARCJET_KEY,
  arcJetEnv: process.env.ARCJET_ENV,
  qstashUrl: process.env.QSTASH_URL,
  qstashToken: process.env.QSTASH_TOKEN,
  serverUrl: process.env.SERVER_URL,
  emailPassword: process.env.EMAIL_PASSWORD
};
