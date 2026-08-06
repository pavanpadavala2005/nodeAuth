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

export const getUserInfo = async (req, res) => {
	const { userId } = req.params;
	if (!userId) {
		return res.status(400).json({
			message: "User ID is required",
		});
	}
	try {
		const user = await User.findById(userId, {
			name: 1,
			email: 1,
			isEmailVerified: 1,
			role: 1,
		});
		if (!user) {
			return res.status(400).json({
				message: "User not found",
			});
		}
		return res.status(200).json({
			message: "User details fetched successfully",
			user,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const deleteUser = async (req, res) => {
	const { userId } = req.params;
	if (!userId) {
		return res.status(400).json({
			message: "User ID is required",
		});
	}
	try {
		const user = await User.findByIdAndDelete(userId);

		if (!user) {
			return res.status(400).json({
				message: "User not found",
			});
		}

		return res.status(200).json({
			message: "User deleted successfully",
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
