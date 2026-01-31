import express from "express";
import requireAuth from "../middlewares/requireAuth.js";
import { getProfile } from "../controller/admin/admin.controller.js";

const router = express.Router();

router.get("/me", requireAuth, getProfile);

export default router;
