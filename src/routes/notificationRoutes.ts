import express from "express";
import { getNotifications, markAsRead } from "../controllers/notificationController.ts";
import { authMiddleware } from "../middleware/auth.ts";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getNotifications);
router.put("/:id/read", markAsRead);

export default router;
