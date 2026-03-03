import express from "express";
import { register, login, getProfile, updateProfile, googleLogin } from "../controllers/authController.ts";
import { authMiddleware } from "../middleware/auth.ts";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

export default router;
