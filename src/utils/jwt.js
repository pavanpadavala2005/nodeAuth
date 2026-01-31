import jwt from "jsonwebtoken";

export const createVerifyToken = (userId, expiresIn = "1d") =>
	jwt.sign(
		{
			sub: userId,
		},
		process.env.JWT_ACCESS_SECRET,
		{
			expiresIn,
		}
	);

export const verifyVerifyToken = (token) => jwt.verify(token, process.env.JWT_ACCESS_SECRET);

export const createAccessToken = (userId, role, tokenVersion) => {
	const payload = {
		sub: userId,
		role,
		tokenVersion,
	};
	return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "30m" });
};

export const verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_ACCESS_SECRET);

export const createRefreshToken = (userId, tokenVersion) => {
	const payload = {
		sub: userId,
		tokenVersion,
	};
	return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

export const verifyRefreshToken = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET);
