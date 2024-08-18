// lib/mailer.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // e.g., 'gmail' or your email service provider
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_APP_PASS, // Your email password or an app-specific password
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
