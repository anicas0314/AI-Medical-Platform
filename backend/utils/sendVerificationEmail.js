import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const sendVerificationEmail = async (email, userId) => {
    try {
        // Generate a verification token using JWT
        const verificationToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" }); // Expires in 1 hour

        // Construct the verification URL
        const verificationUrl = `${process.env.BASE_URL}/api/verify-email?token=${encodeURIComponent(verificationToken)}`;

        // Create a transporter using Nodemailer
        const transporter = nodemailer.createTransport({
            host: process.env.MAILHOG_HOST || "localhost",
            port: process.env.MAILHOG_PORT || 1025,
            secure: false, // MailHog doesn't use SSL
        });

        // Email options
        const mailOptions = {
            from: '"Your App Name" <no-reply@yourapp.com>',
            to: email,
            subject: "Verify Your Email Address",
            html: `
                <h1>Email Verification</h1>
                <p>Please verify your email address by clicking the link below:</p>
                <a href="${verificationUrl}">${verificationUrl}</a>
                <p>If you did not request this, please ignore this email.</p>
            `,
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log("Verification email sent:", info.messageId);
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw error;
    }
};
