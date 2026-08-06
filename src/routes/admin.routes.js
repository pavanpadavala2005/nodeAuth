import express from "express";
<<<<<<< HEAD
import {
	deleteUser,
	getAllUsers,
	getProfile,
	getUserInfo,
} from "../controller/admin/admin.controller.js";
=======
import { getAllUsers, getProfile } from "../controller/admin/admin.controller.js";
>>>>>>> f5e244b5bebe629970d13e9d55233a3d7c0f13b7
import requireAuth from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";

const router = express.Router();

<<<<<<< HEAD
router.get("/users", requireAuth, requireRole("admin"), getAllUsers);
router.get("/users/:userId", requireAuth, requireRole("admin"), getUserInfo);
router.delete("users/:userId", requireAuth, requireRole("admin"), deleteUser);

=======
router.get("/all-users", requireAuth, requireRole("admin"), getAllUsers);
>>>>>>> f5e244b5bebe629970d13e9d55233a3d7c0f13b7
router.get("/me", requireAuth, requireRole("admin"), getProfile);

export default router;
