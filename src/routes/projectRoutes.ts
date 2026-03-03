import express from "express";
import { 
  createProject, 
  getProjects, 
  getProjectById, 
  joinProject, 
  inviteMember,
  updateProject,
  deleteProject,
  removeMember
} from "../controllers/projectController.ts";
import { authMiddleware } from "../middleware/auth.ts";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createProject);
router.post("/invite", inviteMember);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
router.post("/join", joinProject);
router.post("/:id/remove-member", removeMember);

export default router;
