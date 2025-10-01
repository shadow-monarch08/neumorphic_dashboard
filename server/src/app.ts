import express from "express";
import { envVariables } from "./config/env";
import userRouter from "./routes/user.route";
import authRouter from "./routes/auth.route";
import taskRouter from "./routes/task.route";
import connetToDatabase from "./database/mongodb";
import errorMiddleware from "./middleware/error.middleware";
import cookieParser from "cookie-parser";
import arcjetMiddleware from "./middleware/arcjet.middleware";
import workFlowRouter from "./routes/workflow.routes";
import cors from "cors";

const app = express();

// ✅ CORS config
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // allow cookies/authorization headers
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use(arcjetMiddleware);
app.use(errorMiddleware);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/workflows", workFlowRouter);

app.get("/", (req, res) => {
  res.send("welcome to my website");
});

app.listen(envVariables.port, () => {
  console.log(`app listening on port ${envVariables.port}`);
  connetToDatabase();
});
