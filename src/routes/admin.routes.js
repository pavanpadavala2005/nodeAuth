import express from "express";
import { getAllUsers, getProfile } from "../controller/admin/admin.controller.js";
import requireAuth from "../middlewares/requireAuth.js";
import { requireRole } from "../middlewares/requireRole.js";

const router = express.Router();

router.get("/all-users", requireAuth, requireRole("admin"), getAllUsers);
router.get("/me", requireAuth, requireRole("admin"), getProfile);

export default router;
