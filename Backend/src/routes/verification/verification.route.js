import { Router } from "express";
import { sendVerification, verifyEmail, resendVerification } from "../../controller/verification/verification.controller.js";

const router = Router();

router.post("/send", sendVerification);
router.post("/verify", verifyEmail);
router.post("/resend", resendVerification);

export default router;
