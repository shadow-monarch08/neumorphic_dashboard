import mongoose from "mongoose";

interface ITask extends mongoose.Document {
  title: string;
  description: string;
  status: "pending" | "completed" | "expired";
  dueDate: Date;
  user: mongoose.Schema.Types.ObjectId;
}

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    description: {
      type: String,
      required: [true, "Task description is required"],
      trim: true,
      minLength: 2,
      maxLength: 1000,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "expired"],
      default: "pending",
    },
    dueDate: {
      type: Date,
      required: [true, "Task due date is requireed"],
      validate: [
        {
          validator: (value: Date) => !isNaN(value.getTime()), // check valid date
          message: "Due date must be a valid date",
        },
        {
          validator: (value: Date) => value >= new Date(),
          message: "Due date must be on or after the current date",
        },
      ],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
