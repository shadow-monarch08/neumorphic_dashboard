import { WorkflowContext } from "@upstash/workflow";
import { serve } from "@upstash/workflow/express";
import dayjs from "dayjs";

import { sendReminderEmail, TaskType } from "../utils/send-email";
import Task from "../models/task.model";

const REMINDERS = [7, 5, 3, 2, 1, 0];

export const setReminders = serve(
  async (context: WorkflowContext<{ taskId: string }>) => {
    const { taskId } = context.requestPayload;
    const task = await fetchTask(context, taskId);

    if (!task || task.status !== "pending") return;

    const dueDate = dayjs(task.dueDate);

    if (dueDate.isBefore(dayjs())) {
      console.log(`Due date has passed for Task ${taskId}. Stopping workflow.`);
      return;
    }

    for (const daysBefore of REMINDERS) {
      const reminderDate = dueDate.subtract(daysBefore, "day");

      if (reminderDate.isAfter(dayjs())) {
        await sleepUntilReminder(
          context,
          `${daysBefore} days before reminder`,
          reminderDate
        );
      }

      if (dayjs().isSame(reminderDate, "day")) {
        await triggerReminder(
          context,
          `${daysBefore} days before reminder`,
          task
        );
      }
    }
  }
);

const fetchTask = async (
  context: WorkflowContext<{ taskId: string }>,
  taskId: string
) => {
  return await context.run("get task", async () => {
    return Task.findById(taskId).populate("user", "name email");
  });
};

const sleepUntilReminder = async (
  context: WorkflowContext<{ taskId: string }>,
  label: string,
  date: dayjs.Dayjs
) => {
  console.log(`Sleeping until ${label}, reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (
  context: WorkflowContext<{ taskId: string }>,
  label: string,
  task: any
) => {
  return await context.run(label, async () => {
    console.log(`Trigger reminder ${label}`);

    await sendReminderEmail({
      to: task.user.email,
      type: label,
      task: task,
    });
  });
};
