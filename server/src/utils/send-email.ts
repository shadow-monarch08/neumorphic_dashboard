import dayjs, { Dayjs } from "dayjs";
import { emailTemplates } from "./email-template";
import { accountEmail, transporter } from "../config/nodemailer";

export interface TaskType {
  title: string;
  description: string;
  status: "pending" | "completed" | "expired";
  dueDate: Date;
  user: {
    email: string;
    name: string;
  };
}

interface emailTemplateParams {
  userName: string;
  title: string;
  dueDate: string;
  dashboardLink: string;
}

export const sendReminderEmail = async ({
  to,
  type,
  task,
}: {
  to: string;
  type: string;
  task: TaskType;
}) => {
  if (!to || !type) throw new Error("Missing required parameters");

  const template = emailTemplates.find((t) => t.label === type);

  if (!template) throw new Error("Inavalid email type");

  const mailInfo: emailTemplateParams = {
    userName: task.user.name,
    title: task.title,
    dueDate: dayjs(task.dueDate).format("MMM D, YYYY"),
    dashboardLink: "http://localhost:5173/dashboard",
  };

  const message = template.generateBody(mailInfo);
  const subject = template.generateSubject(mailInfo);

  const mailOption = {
    from: accountEmail,
    to: to,
    subject: subject,
    html: message,
  };

  transporter.sendMail(mailOption, (error, info) => {
    if (error) return console.log(error, "Error sending email");

    console.log("Email sent " + info.response);
  });
};
