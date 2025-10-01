interface EmailTemplateParams {
  userName: string;
  title: string;
  dueDate: string;
  dashboardLink: string;
  daysLeft?: number;
}

export const generateEmailTemplate = ({
  userName,
  title,
  dueDate,
  dashboardLink,
  daysLeft,
}: EmailTemplateParams) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Task Reminder</title>
<style>
    body {
        margin: 0;
        padding: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #e0e5ec;
        color: #333;
    }
    .container {
        max-width: 600px;
        margin: 30px auto;
        background-color: #f0f3f7;
        border-radius: 20px;
        padding: 30px;
        box-shadow: 8px 8px 16px #c8d0e7, -8px -8px 16px #ffffff;
    }
    .header {
        text-align: center;
        padding-bottom: 20px;
    }
    .header h1 {
        margin: 0;
        font-size: 36px;
        color: #4a90e2;
        font-weight: 700;
    }
    .content p {
        font-size: 16px;
        margin-bottom: 20px;
        color: #3b3f4a;
    }
    .highlight {
        color: #4a90e2;
        font-weight: 600;
    }
    .info-box {
        background-color: #e5ebf7;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: inset 4px 4px 8px #c8d0e7, inset -4px -4px 8px #ffffff;
    }
    .info-box div {
        padding: 10px 0;
        border-bottom: 1px solid #c8d0e7;
    }
    .info-box div:last-child {
        border-bottom: none;
    }
    a {
        color: #4a90e2;
        text-decoration: none;
        font-weight: 600;
    }
    .footer {
        text-align: center;
        font-size: 14px;
        color: #666;
        padding-top: 15px;
    }

    @media only screen and (max-width: 600px) {
        .container {
            padding: 20px;
        }
        .header h1 {
            font-size: 28px;
        }
    }
</style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>SubDub 🔔</h1>
    </div>
    <div class="content">
        <p>Hello <span class="highlight">${userName}</span>,</p>

        <div class="info-box">
            <div><strong>Task:</strong> ${title}</div>
            <div><strong>Due Date:</strong> ${dueDate}</div>
            ${
              daysLeft !== undefined
                ? `<div><strong>Days Remaining:</strong> ${daysLeft}</div>`
                : ""
            }
        </div>

        <p>
            Please make sure to complete your task on time. You can view or manage your tasks from your
            <a href="${dashboardLink}">dashboard</a>.
        </p>

        <p style="margin-top: 20px;">Best regards,<br /><strong>The SubDub Team</strong></p>
    </div>
    <div class="footer">
        <p>SubDub Inc. | 123 Main St, Anytown, AN 12345</p>
        <p>
            <a href="#">Unsubscribe</a> | 
            <a href="#">Privacy Policy</a>
        </p>
    </div>
</div>
</body>
</html>
`;

export const emailTemplates = [
  {
    label: "7 days before reminder",
    generateSubject: (data: EmailTemplateParams) =>
      `📅 Reminder: Your task "${data.title}" is due in 7 days!`,
    generateBody: (data: EmailTemplateParams) =>
      generateEmailTemplate({ ...data, daysLeft: 7 }),
  },
  {
    label: "3 days before reminder",
    generateSubject: (data: EmailTemplateParams) =>
      `⏳ 3 Days Left: Complete "${data.title}"!`,
    generateBody: (data: EmailTemplateParams) =>
      generateEmailTemplate({ ...data, daysLeft: 3 }),
  },
  {
    label: "1 day before reminder",
    generateSubject: (data: EmailTemplateParams) =>
      `⚡ 1 Day Left for "${data.title}"`,
    generateBody: (data: EmailTemplateParams) =>
      generateEmailTemplate({ ...data, daysLeft: 1 }),
  },
  {
    label: "0 day before reminder",
    generateSubject: (data: EmailTemplateParams) =>
      `🚨 "${data.title}" is due today!`,
    generateBody: (data: EmailTemplateParams) =>
      generateEmailTemplate({ ...data, daysLeft: 0 }),
  },
];
