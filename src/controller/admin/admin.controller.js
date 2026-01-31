import { User } from "../../models/user.model.js";

export const getAllUsers = async (req, res) => {
	try {
		const users = await User.find(
			{
				role: "user",
			},
			{
				name: 1,
				email: 1,
				isEmailVerified: 1,
				createdAt: 1,
			}
		).sort({
			createdAt: -1,
		});

		res.status(200).json({
			users,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getProfile = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({
			message: "details not found",
		});
	}

	try {
		return res.status(200).json({
			user: req.user,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Internal server error" });
	}
};
