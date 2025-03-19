import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { getWelcomeTemplate } from "./emailTemplates.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAILHOG_HOST || "localhost",
  port: process.env.MAILHOG_PORT || 1025,
  secure: false, // MailHog doesn't use SSL
});

// Function to send emails using templates
export async function sendEmail({ to, subject, templateName, templateVars }) {
  let htmlContent = "";

  switch (templateName) {
    case "welcome":
      htmlContent = getWelcomeTemplate(templateVars);
      break;
    default:
      throw new Error(`Unknown template name: ${templateName}`);
  }

  const mailOptions = {
    from: '"Your Company" <no-reply@yourcompany.com>',
    to,
    subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
