import { Router } from "express";
import { sendVerification, verifyEmail, resendVerification, sendPhoneVerification, verifyPhone, resendPhoneVerification } from "../../controller/verification/verification.controller.js";
import { auth } from "../../middleware/auth.js";

const router = Router();

router.post("/send", sendVerification);
router.post("/verify", verifyEmail);
router.post("/resend", resendVerification);

router.post("/send-phone", auth, sendPhoneVerification);
router.post("/verify-phone", auth, verifyPhone);
router.post("/resend-phone", auth, resendPhoneVerification);

export default router;
