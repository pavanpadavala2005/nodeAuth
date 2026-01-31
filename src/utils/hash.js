import bcrypt from "bcryptjs";

export const hashPassword = async (password) => {
	const SALT_ROUNDS = await bcrypt.genSalt(10);
	return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password, hash) => await bcrypt.compare(password, hash);
