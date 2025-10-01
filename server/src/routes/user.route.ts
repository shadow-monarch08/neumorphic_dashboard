import { Router } from "express";
import { getUser } from "../controllers/user.controller";
import authorize from "../middleware/auth.middleware";

const userRouter = Router();

userRouter.get("/", authorize, getUser);

userRouter.post("/", (req, res) => {
  res.send({ title: "CREATE new users" });
});

userRouter.put("/:id", (req, res) => {
  res.send({ title: "UPDATE users" });
});

userRouter.delete("/:id", (req, res) => {
  res.send({ title: "DELETE users" });
});

export default userRouter;
