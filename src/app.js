import express from "express";

import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js";
import passport from "passport";
import path from "path";

const app = express();

express.static(path.join(process.cwd(), "src/uploads/2fa"));

app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());

app.get("/", (req, res) => {
	const routes = [
		{ path: "/health", method: "GET", description: "Check the health of the server" },
		{ path: "/auth/register", method: "POST", description: "Register a new user" },
		{ path: "/auth/login", method: "POST", description: "Log in a user" },
		{
			path: "/auth/resend-verification-email",
			method: "POST",
			description: "Resend verification email",
		},
		{ path: "/auth/verify-email", method: "GET", description: "Verify user email" },
		{ path: "/auth/forgot-password", method: "POST", description: "Request password reset" },
		{ path: "/auth/reset-password", method: "POST", description: "Reset user password" },
		{ path: "/auth/google", method: "GET", description: "Start Google authentication" },
		{ path: "/auth/facebook", method: "GET", description: "Start Facebook authentication" },
		{ path: "/user/me", method: "GET", description: "Get the profile of the logged-in user" },
		{ path: "/admin/all-users", method: "GET", description: "Get all users (admin only)" },
		{ path: "/admin/me", method: "GET", description: "Get admin profile" },
	];

	let html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Node Authentication</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f4f4f4; }
            </style>
        </head>
        <body>
            <h1>Welcome to Node js Authentication</h1>
            <p>Below is a list of all available routes and endpoints and their descriptions:</p>
            <table>
                <thead>
                    <tr>
                        <th>Method</th>
                        <th>Path</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    ${routes
						.map(
							(route) => `
                        <tr>
                            <td>${route.method}</td>
                            <td>${route.path}</td>
                            <td>${route.description}</td>
                        </tr>
                    `
						)
						.join("")}
                </tbody>
            </table>
        </body>
        </html>
    `;

	res.send(html);
});

app.get("/health", (req, res) => {
	res.status(200).json({
		message: "OK",
	});
});

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);

export default app;
