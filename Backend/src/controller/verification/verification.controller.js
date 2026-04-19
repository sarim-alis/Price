import User from "../../models/User.js";
import VerificationToken from "../../models/VerificationToken.js";
import { generateVerificationToken, sendVerificationEmail } from "../../utils/emailService.js";
import { generatePhoneOTP, sendPhoneOTP } from "../../utils/phoneService.js";

export const sendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    await VerificationToken.deleteMany({ userId: user._id, type: "email_verification" });

    const token = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await VerificationToken.create({
      userId: user._id,
      token,
      type: "email_verification",
      expiresAt,
    });

    const emailResult = await sendVerificationEmail(user.email, token, user.name);
    
    if (!emailResult.success) {
      return res.status(500).json({ message: "Failed to send verification email. Please try again later." });
    }

    res.json({ message: "Verification email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    const verificationToken = await VerificationToken.findOne({
      token,
      type: "email_verification",
    });

    if (!verificationToken) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }

    if (verificationToken.expiresAt < new Date()) {
      await VerificationToken.deleteOne({ _id: verificationToken._id });
      return res.status(400).json({ message: "Verification token has expired. Please request a new one." });
    }

    const user = await User.findById(verificationToken.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.emailVerified) {
      await VerificationToken.deleteOne({ _id: verificationToken._id });
      return res.status(400).json({ message: "Email already verified" });
    }

    user.emailVerified = true;
    await user.save();

    await VerificationToken.deleteOne({ _id: verificationToken._id });

    res.json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    await VerificationToken.deleteMany({ userId: user._id, type: "email_verification" });

    const token = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await VerificationToken.create({
      userId: user._id,
      token,
      type: "email_verification",
      expiresAt,
    });

    const emailResult = await sendVerificationEmail(user.email, token, user.name);
    
    if (!emailResult.success) {
      return res.status(500).json({ message: "Failed to send verification email. Please try again later." });
    }

    res.json({ message: "Verification email resent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendPhoneVerification = async (req, res) => {
  try {
    const { phone } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.phoneVerified) {
      return res.status(400).json({ message: "Phone already verified" });
    }

    await VerificationToken.deleteMany({ userId: user._id, type: "phone_verification" });

    const code = generatePhoneOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await VerificationToken.create({
      userId: user._id,
      code,
      type: "phone_verification",
      expiresAt,
    });

    await sendPhoneOTP(phone, code, user.name);

    res.json({ message: "OTP sent successfully. Check console for code.", phone });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyPhone = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;

    const verificationToken = await VerificationToken.findOne({
      userId,
      code,
      type: "phone_verification",
    });

    if (!verificationToken) {
      return res.status(400).json({ message: "Invalid or expired OTP code" });
    }

    if (verificationToken.expiresAt < new Date()) {
      await VerificationToken.deleteOne({ _id: verificationToken._id });
      return res.status(400).json({ message: "OTP code has expired. Please request a new one." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.phoneVerified) {
      await VerificationToken.deleteOne({ _id: verificationToken._id });
      return res.status(400).json({ message: "Phone already verified" });
    }

    user.phoneVerified = true;
    await user.save();

    await VerificationToken.deleteOne({ _id: verificationToken._id });

    res.json({ message: "Phone verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resendPhoneVerification = async (req, res) => {
  try {
    const { phone } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.phoneVerified) {
      return res.status(400).json({ message: "Phone already verified" });
    }

    await VerificationToken.deleteMany({ userId: user._id, type: "phone_verification" });

    const code = generatePhoneOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await VerificationToken.create({
      userId: user._id,
      code,
      type: "phone_verification",
      expiresAt,
    });

    await sendPhoneOTP(phone, code, user.name);

    res.json({ message: "OTP resent successfully. Check console for code.", phone });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
