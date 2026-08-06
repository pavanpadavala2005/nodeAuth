import express from "express";
import {
	deleteUser,
	getAllUsers,
	getProfile,
	getUserInfo,
} from "../controller/admin/admin.controller.js";
import requireAuth from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";

const router = express.Router();

router.get("/users", requireAuth, requireRole("admin"), getAllUsers);
router.get("/users/:userId", requireAuth, requireRole("admin"), getUserInfo);
router.delete("users/:userId", requireAuth, requireRole("admin"), deleteUser);

router.get("/me", requireAuth, requireRole("admin"), getProfile);

export default router;
