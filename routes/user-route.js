import express from "express";
import {
    getProfile,
    updateProfile,
    changePassword,
    getUserStats,
} from "../controller/user-controller.js";
import { protect } from "../middlewares/auth-middleware.js";

const router = express.Router();

router.get("/profile", protect, getProfile);           // Profile get
router.put("/profile", protect, updateProfile);        // Profile update
router.put("/change-password", protect, changePassword); // Password change
router.get("/stats", protect, getUserStats);           // Stats get

export default router;