export const getProfile = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({
			message: "user not found",
		});
	}
	try {
		res.status(200).json({
			user: req.user,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Internal server error" });
	}
};
