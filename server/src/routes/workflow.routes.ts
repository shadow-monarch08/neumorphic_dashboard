import { Router } from "express";
import { setReminders } from "../controllers/workflow.controller";

const workFlowRouter = Router();

workFlowRouter.post("/task/reminder", setReminders);

export default workFlowRouter;
