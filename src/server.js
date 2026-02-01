import "./config/env.js";

import http from "http";

import "./utils/facebookAuth.js";

import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
	await connectDB();

	const server = http.createServer(app);

	server.listen(PORT, () => {
		console.log(`Server running on http://localhost:${PORT}`);
	});
	server.on("error", (err) => {
		if (err.code === "EADDRINUSE") {
			console.error(`❌ Port ${PORT} is already in use`);
			process.exit(1);
		}
	});
}

startServer().catch((err) => {
	console.error("Failed to start server:", err);
	process.exit(1);
});
