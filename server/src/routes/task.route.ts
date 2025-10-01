import { Router } from "express";
import {
  createTask,
  deleteTask,
  getSortedTasks,
  getTaskById,
  getTasksByMonth,
  getUserTask,
  updateTask,
} from "../controllers/task.controller";
import authorize from "../middleware/auth.middleware";

const taskRouter = Router();

taskRouter.get("/", (req, res) => {
  res.send({ title: "GET all subscription" });
});
taskRouter.get("/month", authorize, getTasksByMonth);
taskRouter.get("/:id", authorize, getTaskById);

taskRouter.post("/", authorize, createTask);

taskRouter.put("/:id", authorize, updateTask);
taskRouter.delete("/:id", authorize, deleteTask);
taskRouter.get("/user/:id", authorize, getUserTask);
taskRouter.get("/user/:id/sort", authorize, getSortedTasks);

taskRouter.get("/:id/cancel", (req, res) => {
  res.send({ title: "CANCEL user subscription" });
});
taskRouter.get("/upcoming-renewal", (req, res) => {
  res.send({ title: "GET upcoming subscription renewal" });
});

export default taskRouter;
