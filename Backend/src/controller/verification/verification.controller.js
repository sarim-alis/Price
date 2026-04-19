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

    console.log('=== SEND PHONE VERIFICATION OTP ===');
    console.log('User ID:', userId);
    console.log('Phone:', phone);

    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ message: "User not found" });
    }

    if (user.phoneVerified) {
      console.log('❌ Phone already verified');
      return res.status(400).json({ message: "Phone already verified" });
    }

    await VerificationToken.deleteMany({ userId: user._id, type: "phone_verification" });

    const code = generatePhoneOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    console.log('Generated OTP:', code);
    console.log('Expires at:', expiresAt);

    await VerificationToken.create({
      userId: user._id,
      code,
      type: "phone_verification",
      expiresAt,
    });

    await sendPhoneOTP(phone, code, user.name);

    console.log('✅ OTP sent successfully');
    res.json({ message: "OTP sent successfully. Check console for code.", phone });
  } catch (error) {
    console.error('❌ Send OTP error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const verifyPhone = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;

    console.log('=== PHONE VERIFICATION ATTEMPT ===');
    console.log('User ID:', userId);
    console.log('Submitted Code:', code);
    console.log('Code Type:', typeof code);

    // Find all tokens for this user
    const allTokens = await VerificationToken.find({
      userId,
      type: "phone_verification",
    });
    console.log('All tokens found:', allTokens.length);
    allTokens.forEach(t => {
      console.log(`  - Code: ${t.code}, Expires: ${t.expiresAt}`);
    });

    const verificationToken = await VerificationToken.findOne({
      userId,
      code,
      type: "phone_verification",
    });

    console.log('Matching token found:', !!verificationToken);

    if (!verificationToken) {
      console.log('❌ No matching token found');
      return res.status(400).json({ message: "Invalid or expired OTP code" });
    }

    if (verificationToken.expiresAt < new Date()) {
      console.log('❌ Token expired');
      await VerificationToken.deleteOne({ _id: verificationToken._id });
      return res.status(400).json({ message: "OTP code has expired. Please request a new one." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.phoneVerified) {
      console.log('❌ Phone already verified');
      await VerificationToken.deleteOne({ _id: verificationToken._id });
      return res.status(400).json({ message: "Phone already verified" });
    }

    user.phoneVerified = true;
    await user.save();

    await VerificationToken.deleteOne({ _id: verificationToken._id });

    console.log('✅ Phone verified successfully');
    res.json({ message: "Phone verified successfully" });
  } catch (error) {
    console.error('❌ Phone verification error:', error);
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
