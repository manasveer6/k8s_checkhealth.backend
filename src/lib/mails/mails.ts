import { send_mail } from "./mg_mailer";

export const sendDailyReminder = async (to: string, html: string) => {
  const subject = "Daily reminder for failed deployments";
  const text = `
Hello Team,

This is a friendly reminder that there have been failed deployments detected today. Please review the following details to identify and resolve any issues as soon as possible:
`;
  const response = await send_mail(to, subject, text, html);
  return response;
};

export const sendDeploymentFailureAlert = async (to: string, html: string) => {
  const subject = "Deployment Failure Detected";
  const text = `
Hello Team,

We wanted to bring to your attention that a deployment failure has been detected. Below are the details of the failed deployment:
`;
  const response = await send_mail(to, subject, text, html);
  return response;
};
