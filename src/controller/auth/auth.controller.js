// Models
import { User } from "../../models/user.model.js";

import { sendEmail } from "../../utils/email.js";

// Schema Validation
import { loginSchema, registerSchema } from "./auth.schema.js";

// JWT
import {
	createAccessToken,
	createRefreshToken,
	createVerifyToken,
	verifyRefreshToken,
	verifyVerifyToken,
} from "../../utils/jwt.js";

// BcryptJs
import { generateHashToken, generateSecureToken } from "../../utils/crypto.js";

// Authenticator Logic
import { generateSecret, generateURI, verify as verifyTwoFactorCode } from "otplib";
import { deleteQRCode, generateQRCode, getQRCodePath } from "../../utils/qrCode.js";

const getAppUrl = () => {
	return process.env.APP_URL;
};

// Google Authentication
import { getGoogleClient } from "../../utils/googleAuth.js";

import { comparePassword, hashPassword } from "../../utils/hash.js";

export const registerHandler = async (req, res) => {
	try {
		const result = registerSchema.safeParse(req.body);
		if (!result.success) {
			return res
				.status(400)
				.json({ message: "Invalid request data", errors: result.error.flatten });
		}
		const { name, email, password, confirmPassword } = result.data;
		if (password !== confirmPassword) {
			return res.status(400).json({ message: "Passwords do not match" });
		}
		const normalizeEmail = email.toLowerCase().trim();
		const existingUser = await User.findOne({
			email: normalizeEmail,
		});
		if (existingUser) {
			return res
				.status(400)
				.json({ message: "Email already in use Please try with different Email!" });
		}
		const passwordHash = await hashPassword(password);
		const newlyCreatedUser = await User.create({
			email: normalizeEmail,
			passwordHash,
			name,
			isEmailVerified: false,
			twoFactorEnabled: false,
		});

		const verifyToken = createVerifyToken(newlyCreatedUser.id);

		const verifyUrl = `${getAppUrl()}/auth/verify-email?token=${verifyToken}`;
		await sendEmail(
			newlyCreatedUser.email,
			"Verify your email",
			`<p>Please click the link below to verify your email:</p>
		    <a href="${verifyUrl}">${verifyUrl}</a>`
		);

		return res.status(201).json({
			message: "Registration successful! Please check your email to verify your account.",
			user: {
				email: newlyCreatedUser.email,
				name: newlyCreatedUser.name,
				role: newlyCreatedUser.role,
				isEmailVerified: newlyCreatedUser.isEmailVerified,
			},
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const verifyEmailHandler = async (req, res) => {
	const { token } = req.query;

	if (!token) return res.status(400).json({ message: "Verification token is missing" });
	try {
		// const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
		const payload = verifyVerifyToken(token);

		const existingUser = await User.findById(payload.sub);
		if (!existingUser) {
			return res.status(400).json({ message: "Invalid verification token" });
		}

		if (existingUser.isEmailVerified) {
			return res.status(400).json({ message: "Email is already verified you can Login" });
		}

		existingUser.isEmailVerified = true;
		existingUser.save();

		return res.status(200).json({
			message: "Email verified successfully",
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({ message: "Invalid or expired verification token" });
	}
};

export const getNewVerifyEmailHandler = async (req, res) => {
	const { email } = req.body;
	if (!email) {
		return res.status(400).json({ message: "Email is required" });
	}
	try {
		const normalizeEmail = email.toLowerCase().trim();
		const existingUser = await User.findOne({
			email: normalizeEmail,
		});

		if (!existingUser) {
			return res.status(200).json({
				message: "If user registered earlier you will get a verification mail.",
			});
		}

		if (existingUser.isEmailVerified) {
			return res.status(200).json({
				message: " Email is already verified you can Login with credentials",
			});
		}

		const verifyToken = createVerifyToken(newlyCreatedUser.id);

		const verifyUrl = `${getAppUrl()}/auth/verify-email?token=${verifyToken}`;
		await sendEmail(
			newlyCreatedUser.email,
			"Verify your email",
			`<p>Please click the link below to verify your email:</p>
		    <a href="${verifyUrl}">${verifyUrl}</a>`
		);

		res.status(200).json({
			message: "If user registered earlier you will get a verification mail.",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const loginHandler = async (req, res) => {
	try {
		const result = loginSchema.safeParse(req.body);
		if (!result.success) {
			return res
				.status(400)
				.json({ message: "Invalid request data", errors: result.error.flatten });
		}
		const { email, password, twoFactorCode } = result.data;

		const normalizeEmail = email.toLowerCase().trim();

		const existingUser = await User.findOne({
			email: normalizeEmail,
		});

		if (!existingUser) {
			return res.status(400).json({ message: "Invalid email or password" });
		}

		const isPasswordValid = await comparePassword(password, existingUser.passwordHash);

		if (!isPasswordValid) {
			return res.status(400).json({ message: "Invalid email or password" });
		}

		if (!existingUser.isEmailVerified) {
			return res
				.status(403)
				.json({ message: "Email is not verified. Please verify your email to login." });
		}
		if (existingUser.twoFactorEnabled) {
			if (!twoFactorCode || typeof twoFactorCode !== "string") {
				return res.status(400).json({
					message: "Two factor code is missing",
				});
			}
			if (!existingUser.twoFactorSecret) {
				return res.status(400).json({
					message: " Two factor authentication is not properly set up for this account.",
				});
			}

			// Verify using code here OTPLIB
			const { valid: isValid } = await verifyTwoFactorCode({
				token: twoFactorCode,
				secret: existingUser.twoFactorSecret,
			});

			if (!isValid) {
				return res.status(401).json({
					message: "Invalid two factor code",
				});
			}
		}

		const accessToken = createAccessToken(
			existingUser.id,
			existingUser.role,
			existingUser.tokenVersion
		);

		const refreshToken = createRefreshToken(existingUser.id, existingUser.tokenVersion);

		const isProd = process.env.NODE_ENV === "production";

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: isProd,
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		});

		return res.status(200).json({
			message: "Login successful",
			accessToken,
			user: {
				id: existingUser.id,
				email: existingUser.email,
				role: existingUser.role,
				isEmailVerified: existingUser.isEmailVerified,
				twoFactorEnabled: existingUser.twoFactorEnabled,
			},
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const refreshHandler = async (req, res) => {
	try {
		const token = req.cookies.refreshToken;
		if (!token) {
			return res.status(401).json({ message: "Refresh token missing" });
		}
		const payload = verifyRefreshToken(token);

		const existingUser = await User.findById(payload.sub);

		if (!existingUser) {
			return res.status(401).json({ message: "User not found" });
		}

		if (existingUser.tokenVersion !== payload.tokenVersion) {
			return res.status(401).json({ message: "Token has been revoked" });
		}

		const newAccessToken = createAccessToken(
			existingUser.id,
			existingUser.role,
			existingUser.tokenVersion
		);

		const newRefreshToken = createRefreshToken(existingUser.id, existingUser.tokenVersion);

		const isProd = process.env.NODE_ENV === "production";

		res.cookie("refreshToken", newRefreshToken, {
			httpOnly: true,
			secure: isProd,
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		});

		return res.status(200).json({
			message: "Token refreshed",
			accessToken: newAccessToken,
			user: {
				id: existingUser.id,
				email: existingUser.email,
				role: existingUser.role,
				isEmailVerified: existingUser.isEmailVerified,
				twoFactorEnabled: existingUser.twoFactorEnabled,
			},
		});
	} catch (error) {
		console.log(error);
		return res.status(401).json({ message: "Invalid or expired refresh token" });
	}
};

export const logOutHandler = async (req, res) => {
	res.clearCookie("refreshToken", {
		path: "/",
	});

	return res.status(200).json({
		message: "Logged out",
	});
};

export const forgotPasswordHandler = async (req, res) => {
	try {
		const { email } = req.body;
		const normalizeEmail = email.toLowerCase().trim();

		const existingUser = await User.findOne({
			email: normalizeEmail,
		});

		if (!existingUser) {
			return res.status(400).json({
				message:
					"If that email address is in our database, we will send you an email to reset your password.",
			});
		}

		const rawToken = generateSecureToken(32);

		const tokenHash = generateHashToken(rawToken);

		existingUser.resetPasswordToken = tokenHash;
		existingUser.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

		const passwordResetUrl = `${getAppUrl()}/auth/reset-password?token=${rawToken}`;

		await sendEmail(
			existingUser.email,
			"Password Reset Request",
			`<p>Please click the link below to reset your password. This link will expire in 15 minutes:</p>
		    <a href="${passwordResetUrl}">${passwordResetUrl}</a>`
		);

		await existingUser.save();

		return res.status(200).json({
			message:
				"If that email address is in our database, we will send you an email to reset your password.",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const resetPasswordHandle = async (req, res) => {
	try {
		const { token, newPassword } = req.body;
		const tokenHash = generateHashToken(token);

		const existingUser = await User.findOne({
			resetPasswordToken: tokenHash,
			resetPasswordExpires: { $gt: new Date() },
		});

		if (!existingUser) {
			return res.status(400).json({ message: "Invalid or token expired" });
		}

		const newPasswordHash = await hashPassword(newPassword);

		existingUser.passwordHash = newPasswordHash;

		existingUser.resetPasswordToken = undefined;
		existingUser.resetPasswordExpires = undefined;

		existingUser.tokenVersion = existingUser.tokenVersion + 1;

		await existingUser.save();

		return res.status(200).json({
			message: "Password has been reset successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const changePasswordHandler = async (req, res) => {
	const user = req.user;
	if (!user) {
		return res.status(401).json({ message: "Not authenticated" });
	}
	try {
		const currentPassword = req.body.currentPassword;
		const newPassword = req.body.newPassword;
		const twoFactorCode = req.body.twoFactorCode;

		if (!currentPassword || !newPassword) {
			return res
				.status(400)
				.json({ message: "Current password and new password are required" });
		}
		if (currentPassword === newPassword) {
			return res
				.status(400)
				.json({ message: "New password must be different from current password" });
		}

		const existingUser = await User.findById(user.id);

		if (!existingUser) {
			return res.status(404).json({ message: "User not found" });
		}

		if (existingUser.twoFactorEnabled) {
			if (!twoFactorCode) {
				return res.status(400).json({
					message: "Two factor code is missing",
				});
			}
			const { valid: isValid } = await verifyTwoFactorCode({
				token: twoFactorCode,
				secret: existingUser.twoFactorSecret,
			});

			if (!isValid) {
				return res.status(401).json({
					message: "Invalid two factor code",
				});
			}
		}

		const isPasswordValid = await comparePassword(currentPassword, existingUser.passwordHash);
		if (!isPasswordValid) {
			return res.status(400).json({ message: "Current password is incorrect" });
		}

		const newPasswordHash = await hashPassword(newPassword);
		existingUser.passwordHash = newPasswordHash;

		existingUser.tokenVersion = existingUser.tokenVersion + 1;

		await existingUser.save();

		return res.status(200).json({ message: "Password changed successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const googleCallbackHandler = async (req, res) => {
	const code = req.query.code;
	if (!code)
		return res.status(400).json({
			message: "Missing code in callback",
		});

	try {
		const client = getGoogleClient();

		const { tokens } = await client.getToken(code);

		if (!tokens.id_token) {
			return res.status(400).json({
				message: "google id_token is missing",
			});
		}

		const ticket = await client.verifyIdToken({
			idToken: tokens.id_token,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();

		const email = payload?.email;
		const emailVerified = payload?.email_verified;
		const name = payload?.name;

		if (!email || !emailVerified) {
			return res.status(400).json({
				message: "Email is not verified !!",
			});
		}

		const normalizeEmail = email.toLowerCase().trim();

		let existingUser = await User.findOne({
			email: normalizeEmail,
		});

		if (!existingUser) {
			const randomPassword = generateSecureToken();

			existingUser = await User.create({
				email: normalizeEmail,
				passwordHash: randomPassword,
				name,
				role: "user",
				isEmailVerified: true,
				twoFactorEnabled: false,
				authProvider: "google",
				googleId: tokens.id_token,
			});
		} else {
			if (!existingUser.isEmailVerified) {
				existingUser.isEmailVerified = true;
				await existingUser.save();
			}
		}

		const accessToken = await createAccessToken(
			existingUser.id,
			existingUser.role,
			existingUser.tokenVersion
		);

		const refreshToken = await createRefreshToken(existingUser.id, existingUser.tokenVersion);

		const isProd = process.env.NODE_ENV === "production";

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: isProd,
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		});

		return res.status(200).json({
			message: "Google login successful",
			accessToken,
			user: {
				id: existingUser.id,
				email: existingUser.email,
				role: existingUser.role,
				isEmailVerified: existingUser.isEmailVerified,
			},
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Internal server error",
		});
	}
};

export const googleAuthStartHandler = (req, res) => {
	try {
		const client = getGoogleClient();

		const url = client.generateAuthUrl({
			access_type: "offline",
			prompt: "consent",
			scope: ["openid", "email", "profile"],
		});

		return res.redirect(url);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const facebookCallbackHandler = async (req, res) => {
	if (!req.user) {
		return res.status(401).json({ message: "Facebook authentication failed" });
	}

	const profile = req.user;

	const facebookId = profile.id;
	const email = profile.emails?.[0]?.value ?? null;
	const normalizeEmail = email ? email.toLowerCase().trim() : null;
	const name = profile.displayName;
	const avatar = profile.photos?.[0]?.value ?? null;

	if (!facebookId) {
		return res.status(400).json({ message: "Facebook ID missing" });
	}

	try {
		let existingUser = await User.findOne({ facebookId });

		if (!existingUser && normalizeEmail) {
			existingUser = await User.findOne({ email: normalizeEmail });

			if (existingUser && !existingUser.facebookId) {
				existingUser.facebookId = facebookId;
				existingUser.authProvider = "facebook";
				await existingUser.save();
			}
		}

		if (!existingUser) {
			const randomPassword = generateSecureToken();

			existingUser = await User.create({
				email: normalizeEmail,
				passwordHash: randomPassword,
				name,
				facebookId,
				avatar,
				role: "user",
				authProvider: "facebook",
				isEmailVerified: !!email,
				twoFactorEnabled: false,
				passwordHash: null,
			});
		}

		const accessToken = await createAccessToken(
			existingUser.id,
			existingUser.role,
			existingUser.tokenVersion
		);

		const refreshToken = await createRefreshToken(existingUser.id, existingUser.tokenVersion);

		const isProd = process.env.NODE_ENV === "production";

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: isProd,
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return res.status(200).json({
			message: "Facebook login successful",
			accessToken,
			user: {
				id: existingUser.id,
				email: existingUser.email ?? undefined,
				facebookId: existingUser.facebookId,
				role: existingUser.role,
				isEmailVerified: existingUser.isEmailVerified,
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

export const setupTwoFactorHandler = async (req, res) => {
	const user = req.user;
	if (!user) {
		return res.status(400).json({
			message: "Not authenticated",
		});
	}
	try {
		const existingUser = await User.findById(user.id);

		if (!existingUser) {
			return res.status(400).json({
				message: "User not found",
			});
		}

		if (existingUser.twoFactorEnabled) {
			return res.status(400).json({
				message: "Two factor authentication is already enabled",
			});
		}

		const issuer = "MyApp";
		const label = existingUser.email;
		const secret = generateSecret();

		const otpAuthUrl = generateURI({
			issuer,
			label,
			secret,
		});

		existingUser.twoFactorSecret = secret;
		existingUser.twoFactorEnabled = false;

		await existingUser.save();

		const qrRes = await generateQRCode(
			otpAuthUrl,
			`qrcode_${existingUser.id}_${existingUser.name}.png`
		);

		if (!qrRes.status) {
			return res.status(500).json({
				message: "Error while generating Qr code",
			});
		}

		return res.status(200).json({
			message: "Two factor authentication setup initiated",
			otpAuthUrl,
			secret,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getTwoFactorQrHandler = async (req, res) => {
	const user = req.user;
	if (!user) {
		return res.status(400).json({
			message: "Not authenticated",
		});
	}
	const userId = req.params.userId;
	if (userId !== user.id) {
		return res.status(400).json({
			message: "Unauthorized access",
		});
	}
	try {
		const existingUser = await User.findById(user.id);
		if (!existingUser) {
			return res.status(400).json({
				message: "User not found",
			});
		}

		if (!existingUser.twoFactorSecret) {
			return res.status(400).json({
				message: " Two factor authentication is not initiated",
			});
		}

		if (existingUser.twoFactorEnabled) {
			return res.status(400).json({
				message: " Two factor authentication is already enabled",
			});
		}

		const getQRCode = getQRCodePath(existingUser.id);

		res.sendFile(getQRCode);
	} catch (error) {
		console.log(error);
		return res.status(200).json({
			message: "Internal server error",
		});
	}
};

export const enableTwoFactorHandler = async (req, res) => {
	const user = req.user;
	if (!user) {
		return res.status(401).json({ message: "Not authenticated" });
	}

	const { code } = req.body;
	if (!code) {
		return res.status(400).json({
			message: "Two factor code is required",
		});
	}

	try {
		const existingUser = await User.findById(user.id);
		if (!existingUser) {
			return res.status(404).json({
				message: "User not found",
			});
		}

		if (!existingUser.twoFactorSecret) {
			return res.status(400).json({
				message: "2FA is not initialized",
			});
		}

		const { valid: isValid } = await verifyTwoFactorCode({
			token: code,
			secret: existingUser.twoFactorSecret,
		});

		if (!isValid) {
			return res.status(401).json({
				message: "Invalid two factor code",
			});
		}

		existingUser.twoFactorEnabled = true;
		await existingUser.save();

		return res.status(200).json({
			message: "Two factor authentication enabled successfully",
			twoFactorEnabled: true,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Internal server error",
		});
	}
};

export const disableTwoFactorHandle = async (req, res) => {
	const user = req.user;
	if (!user) {
		return res.status(401).json({ message: "Not authenticated" });
	}
	const { code } = req.body;
	if (!code) {
		return res.status(400).json({
			message: "Two factor code is required",
		});
	}
	try {
		const existingUser = await User.findById(user.id);
		if (!existingUser) {
			return res.status(404).json({
				message: "User not found",
			});
		}

		if (!existingUser.twoFactorEnabled) {
			return res.status(400).json({
				message: " Two factor authentication is not enabled",
			});
		}

		const { valid: isValid } = await verifyTwoFactorCode({
			token: code,
			secret: existingUser.twoFactorSecret,
		});

		if (!isValid) {
			return res.status(401).json({
				message: "Invalid two factor code",
			});
		}

		existingUser.twoFactorEnabled = false;
		existingUser.twoFactorSecret = undefined;

		const isQRDeleted = deleteQRCode(existingUser.id);
		if (!isQRDeleted) {
			return res.status(400).json({
				message: "Error while disabling two factor authentication",
			});
		}

		await existingUser.save();

		return res.status(200).json({
			message: "Two factor authentication disabled successfully",
			twoFactorEnabled: false,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Internal server error",
		});
	}
};
