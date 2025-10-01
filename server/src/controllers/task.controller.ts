import { Request, Response, NextFunction } from "express";
import Task from "../models/task.model";
import { Types } from "mongoose";
import { workFlowClient } from "../config/upstash";
import { envVariables } from "../config/env";
import dayjs from "dayjs";
import mongoose from "mongoose";

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const task = await Task.create({
      ...req.body,
      user: req.user._id,
    });

    const { workflowRunId } = await workFlowClient.trigger({
      url: `${envVariables.serverUrl}/api/v1/workflows/task/reminder`,
      body: {
        taskId: task._id,
      },
      headers: {
        "content-type": "application/json",
      },
      retries: 0,
    });

    res.status(201).json({ success: true, data: { task, workflowRunId } });
  } catch (error) {
    next(error);
  }
};

export const getUserTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get pagination params
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      Task.find({ user: req.user._id })
        .sort({ createdAt: -1 }) // latest first
        .skip(skip)
        .limit(limit),
      Task.countDocuments({ user: req.user._id }),
    ]);

    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /tasks/:id
 * Body can contain any of: title, description, status, dueDate
 */
export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // validate id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid task id" });
      return;
    }

    // whitelist allowed fields to update
    const allowedUpdates = ["title", "description", "status", "dueDate"];
    const incomingKeys = Object.keys(req.body);
    const invalidKeys = incomingKeys.filter((k) => !allowedUpdates.includes(k));
    if (invalidKeys.length > 0) {
      let error: any = new Error(`Invalid fields: ${invalidKeys.join(", ")}`);
      error.statusCode = 400;
      throw error;
    }

    // if dueDate provided, parse & validate (must be today or future per your model)
    if (
      req.body.dueDate !== undefined &&
      req.body.dueDate !== null &&
      req.body.dueDate !== ""
    ) {
      const parsed = dayjs(req.body.dueDate);
      if (!parsed.isValid()) {
        let error: any = new Error("Invalid dueDate format");
        error.statusCode = 400;
        throw error;
      }
      if (parsed.isBefore(dayjs(), "day")) {
        let error: any = new Error("dueDate must be today or in the future");
        error.statusCode = 400;
        throw error;
      }
    }

    // fetch task so we run schema validators that rely on `this`
    const task = await Task.findById(id);
    if (!task) {
      let error: any = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    // apply updates
    for (const key of incomingKeys) {
      // note: dueDate is validated above; Mongoose schema will validate again on save.
      (task as any)[key] = req.body[key];
    }

    // automatic status adjustment:
    // If dueDate is now in the past (shouldn't happen because we validated), set expired;
    // Otherwise if status explicitly set, allow it (e.g. completed).
    if (
      task.dueDate &&
      dayjs(task.dueDate).isBefore(dayjs(), "day") &&
      task.status !== "completed"
    ) {
      task.status = "expired";
    }

    // Save (runs schema validators)
    await task.save();

    const { workflowRunId } = await workFlowClient.trigger({
      url: `${envVariables.serverUrl}/api/v1/workflows/task/reminder`,
      body: {
        taskId: task._id,
      },
      headers: {
        "content-type": "application/json",
      },
      retries: 0,
    });

    res.status(200).json({ success: true, task, workflowRunId });
  } catch (err: any) {
    // Mongoose validation error handling
    next(err);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // validate id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      let error: any = new Error("Invalid task id");
      error.statusCode = 400;
      throw error;
    }

    const task = await Task.findById(id);
    if (!task) {
      let error: any = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    await task.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /tasks/:id
 */
export const getTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      let error: any = new Error("Invalid task id");
      error.statusCode = 400;
      throw error;
    }

    const task = await Task.findById(id);
    if (!task) {
      let error: any = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, task });
  } catch (err) {
    next(err);
  }
};

export const getSortedTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortField = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Only allow sorting by defined fields
    const validFields = [
      "title",
      "description",
      "status",
      "createdAt",
      "dueDate",
    ];
    const sortOptions: Record<string, 1 | -1> = {};

    if (validFields.includes(sortField as string)) {
      sortOptions[sortField as string] = sortOrder === "asc" ? 1 : -1;
    } else {
      sortOptions["createdAt"] = -1; // fallback
    }

    // Query
    const query = { user: req.user._id };

    const tasks = await Task.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: pageNum * limitNum < total,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTasksByMonth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      res.status(400).json({
        success: false,
        message: "Both month and year are required",
      });
      return;
    }

    const numericMonth = parseInt(month as string, 10);
    const numericYear = parseInt(year as string, 10);

    if (
      isNaN(numericMonth) ||
      numericMonth < 1 ||
      numericMonth > 12 ||
      isNaN(numericYear)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid month or year provided",
      });
      return;
    }

    // First day of month
    const startDate = dayjs(`${numericYear}-${numericMonth}-01`)
      .startOf("month")
      .toDate();

    // Last day of month
    const endDate = dayjs(startDate).endOf("month").toDate();

    const tasks = await Task.find({
      user: req.user._id,
      dueDate: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ dueDate: 1 }); // earliest to latest in that month

    res.status(200).json({
      success: true,
      data: {
        tasks,
        filter: { month: numericMonth, year: numericYear },
      },
    });
  } catch (error) {
    next(error);
  }
};
