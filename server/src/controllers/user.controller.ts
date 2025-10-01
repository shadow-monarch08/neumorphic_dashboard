import Task from "../models/task.model";
import User from "../models/user.model";
import { Response, Request, NextFunction } from "express";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      const error: Partial<any> = new Error("No user found");
      (error as any).statusCode = 404;
      throw error;
    }

    // Fetch task counts in parallel for efficiency
    const [totalTasks, completedTasks] = await Promise.all([
      Task.countDocuments({ user: req.user._id }),
      Task.countDocuments({ user: req.user._id, status: "completed" }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        user,
        taskSummary: {
          totalTasks,
          completedTasks,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
