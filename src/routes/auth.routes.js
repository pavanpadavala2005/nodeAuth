import express from "express";
import {
	loginHandler,
	logOutHandler,
	refreshHandler,
	registerHandler,
	verifyEmailHandler,
	forgotPasswordHandler,
	resetPasswordHandle,
	googleAuthStartHandler,
	googleCallbackHandler,
	enableTwoFactorHandler,
	setupTwoFactorHandler,
	disableTwoFactorHandle,
	getNewVerifyEmailHandler,
	facebookCallbackHandler,
	getTwoFactorQrHandler,
	changePasswordHandler,
} from "../controller/auth/auth.controller.js";

import requireAuth from "../middlewares/requireAuth.js";
import { facebookAuth, facebookAuthCallback } from "../middlewares/facebookAuth.js";

const router = express.Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);

router.post("/resend-verification-email", getNewVerifyEmailHandler);
router.get("/verify-email", verifyEmailHandler);

router.post("/forgot-password", forgotPasswordHandler);
router.post("/reset-password", resetPasswordHandle);
router.post("/change-password", requireAuth, changePasswordHandler);

router.post("/refresh", requireAuth, refreshHandler);
router.post("/logout", requireAuth, logOutHandler);

router.get("/google", googleAuthStartHandler);
router.get("/google/callback", googleCallbackHandler);

router.get("/facebook", facebookAuth);
router.get("/facebook/callback", facebookAuthCallback, facebookCallbackHandler);

router.post("/2fa/setup", requireAuth, setupTwoFactorHandler);
router.post("/2fa/verify", requireAuth, enableTwoFactorHandler);

router.get("/2fa/qr-code/:userId", requireAuth, getTwoFactorQrHandler);
router.post("/2fa/disable", requireAuth, disableTwoFactorHandle);

router.get("/success", (req, res) => {
	res.status(200).json({ message: "Authentication Successful" });
});

export default router;
