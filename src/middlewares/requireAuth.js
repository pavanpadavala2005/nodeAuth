import { verifyAccessToken } from "../utils/jwt.js";
import { User } from "../models/user.model.js";

const requireAuth = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(400).json({
				message: "Access token is missing",
			});
		}
		const token = authHeader.split(" ")[1];

		const payload = verifyAccessToken(token);

		const existingUser = await User.findById(payload.sub);

		if (!existingUser) {
			return res.status(400).json({
				message: "User Not found !",
			});
		}
		if (existingUser.tokenVersion !== payload.tokenVersion) {
			return res.status(401).json({
				message: "Invalidated token",
			});
		}

		req.user = {
			id: existingUser.id,
			email: existingUser.email,
			name: existingUser.name,
			role: existingUser.role,
			isEmailVerified: existingUser.isEmailVerified,
		};

		next();
	} catch (err) {
		if (err.name === "TokenExpiredError") {
			return res.status(401).json({
				message: "Access token expired",
				code: "TOKEN_EXPIRED",
			});
		}

		return res.status(401).json({ message: "Invalid token" });
	}
};

export default requireAuth;
