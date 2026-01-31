import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import QRCode from "qrcode";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.resolve(__dirname, "..", "uploads", "2fa");

export const generateQRCode = async (url, fileName = "qrcode.png") => {
	try {
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}
		const filePath = path.join(outputDir, fileName);

		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
		}

		await QRCode.toFile(filePath, url);

		return {
			status: true,
			filePath,
		};
	} catch (error) {
		console.log(error);
	}
};

export const getQRCodePath = (id) => {
	try {
		const allFiles = fs.readdirSync(outputDir);
		const userFile = allFiles.find((file) => file.includes(id));
		return path.join(outputDir, userFile);
	} catch (error) {
		console.log("QR code fetch Error:", error);
		return null;
	}
};

export const deleteQRCode = (id) => {
	try {
		const allFiles = fs.readdirSync(outputDir);
		if (!allFiles.length) return false;

		const userFile = allFiles.find((file) => file.includes(id));
		if (!userFile) return false;

		const userFilePath = path.join(outputDir, userFile);
		fs.unlinkSync(userFilePath);

		return true;
	} catch (error) {
		console.log("QR code delete Error:", error);
		return false;
	}
};
