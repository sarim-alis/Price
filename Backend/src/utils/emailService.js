import nodemailer from "nodemailer";
import crypto from "crypto";
import { serverConfig } from '../config/server.js';
const FRONTEND_URL = process.env.FRONTEND_URL || serverConfig.FRONTEND_URL;

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: "sarimslayerali786@gmail.com",
    pass: "hmsn ilgt swrn wkds",
  },
});

export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const sendVerificationEmail = async (email, token, name) => {
  const verificationUrl = `${FRONTEND_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email - Zod Mobile",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #faf8f6;">
        <div style="background-color: #7b5740; padding: 32px 24px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 1px;">Zod Mobile</h1>
        </div>
        <div style="padding: 32px 24px; border: 1px solid #e9ded6; border-top: none; border-radius: 0 0 8px 8px; background-color: #ffffff;">
          <h2 style="color: #2d2d2d; margin: 0 0 16px 0; font-size: 22px;">Welcome to Zod Mobile, ${name}!</h2>
          <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 12px 0;">
            Thank you for registering. Please verify your email address to complete your registration and start using the app.
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${verificationUrl}" style="background-color: #7b5740; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;">Verify Email</a>
          </div>
          <p style="color: #999999; font-size: 14px; line-height: 1.5; margin: 16px 0 8px 0; text-align: center;">
            Or copy and paste this link in your browser:
          </p>
          <p style="color: #666666; font-size: 13px; line-height: 1.4; margin: 0; word-break: break-all; background-color: #faf8f6; padding: 12px; border-radius: 4px; border: 1px solid #e9ded6;">
            ${verificationUrl}
          </p>
          <hr style="border: none; border-top: 1px solid #e9ded6; margin: 24px 0;" />
          <p style="color: #999999; font-size: 13px; line-height: 1.5; margin: 0;">
            This link will expire in 24 hours.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const sendPasswordResetEmail = async (email, token, name) => {
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password - Zod Mobile",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #faf8f6;">
        <div style="background-color: #7b5740; padding: 32px 24px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 1px;">Zod Mobile</h1>
        </div>
        <div style="padding: 32px 24px; border: 1px solid #e9ded6; border-top: none; border-radius: 0 0 8px 8px; background-color: #ffffff;">
          <h2 style="color: #2d2d2d; margin: 0 0 16px 0; font-size: 22px;">Password Reset Request</h2>
          <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 12px 0;">
            Hi ${name}, we received a request to reset your password. Click the button below to reset it:
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${resetUrl}" style="background-color: #7b5740; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #999999; font-size: 14px; line-height: 1.5; margin: 16px 0 8px 0; text-align: center;">
            Or copy and paste this link in your browser:
          </p>
          <p style="color: #666666; font-size: 13px; line-height: 1.4; margin: 0; word-break: break-all; background-color: #faf8f6; padding: 12px; border-radius: 4px; border: 1px solid #e9ded6;">
            ${resetUrl}
          </p>
          <hr style="border: none; border-top: 1px solid #e9ded6; margin: 24px 0;" />
          <p style="color: #999999; font-size: 13px; line-height: 1.5; margin: 0;">
            This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: error.message };
  }
};
