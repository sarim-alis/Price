import crypto from "crypto";

export const generatePhoneOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendPhoneOTP = async (phone, code, name) => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║              PHONE VERIFICATION OTP                        ║
╠════════════════════════════════════════════════════════════╣
║  Name:  ${name.padEnd(48)} ║
║  Phone: ${phone.padEnd(48)} ║
║  OTP:   ${code.padEnd(48)} ║
╠════════════════════════════════════════════════════════════╣
║  This code will expire in 10 minutes                       ║
║  DO NOT share this code with anyone                        ║
╚════════════════════════════════════════════════════════════╝
  `);
  
  return { success: true, message: "OTP logged to console (custom backend)" };
};
