import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAILHOG_HOST,
    port: process.env.MAILHOG_PORT,
    secure: false, // MailHog doesn't use SSL
});

const sender = {
    name: "Mailhog Test",
    address: "mailhog@demomailhog.com",
};

const recipients = ["apratimdutta.2003@gmail.com"];

transporter.sendMail({
    from: sender,
    to: recipients,
    subject: "Test Mail",
    text: "Hello, this is a test mail from Mailhog",
})
.then(info => console.log("Email sent:", info))
.catch(err => console.error("Error sending email:", err));
