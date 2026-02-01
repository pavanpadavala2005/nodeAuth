import crypto from "crypto";

export const generateSecureToken = (size = 32) => crypto.randomBytes(size).toString("hex");

export const generateHashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");
