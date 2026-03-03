import express from "express";
import { getDashboardStats, getTeamPerformance } from "../controllers/dashboardController.ts";
import { authMiddleware } from "../middleware/auth.ts";

const router = express.Router();

router.use(authMiddleware);

router.get("/stats", getDashboardStats);
router.get("/performance/:projectId", getTeamPerformance);

export default router;
