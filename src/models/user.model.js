import mongoose from "mongoose";
<<<<<<< HEAD
=======
import { boolean } from "zod";
import { lowercase, required } from "zod/mini";
>>>>>>> f5e244b5bebe629970d13e9d55233a3d7c0f13b7

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			unique: true,
			lowercase: true,
			trim: true,
		},
		passwordHash: {
			type: String,
			required: function () {
				return this.authProvider === "local";
			},
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
		isEmailVerified: {
			type: Boolean,
			default: false,
		},
		name: {
			type: String,
			trim: true,
		},
		twoFactorEnabled: {
			type: Boolean,
			default: false,
		},
		twoFactorSecret: {
			type: String,
			default: undefined,
		},
		tokenVersion: {
			type: Number,
			default: 0,
		},
		resetPasswordToken: {
			type: String,
			default: undefined,
		},
		resetPasswordExpires: {
			type: Date,
			default: undefined,
		},
		authProvider: {
			type: String,
			enum: ["local", "google", "facebook"],
			default: "local",
		},
		facebookId: {
			type: String,
			default: undefined,
		},
		googleId: {
			type: String,
			default: undefined,
		},
	},
	{
		timestamps: true,
	}
);

export const User = mongoose.model("User", userSchema);
