// import "../config/env.js";
import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
	if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
		console.log("Gmail SMTP configuration is missing");
		return;
	}

	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.GMAIL_USER,
			pass: process.env.GMAIL_APP_PASSWORD,
		},
	});

	await transporter.sendMail({
		from: `"My App" <nodeAppTesting@gmail.com>`,
		to,
		subject,
		html,
	});
};
