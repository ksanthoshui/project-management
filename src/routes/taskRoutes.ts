import express from "express";
import { 
  createTask, 
  getTasksByProject, 
  updateTask, 
  addComment, 
  deleteTask, 
  addSubtask, 
  toggleSubtask, 
  uploadAttachment 
} from "../controllers/taskController.ts";
import { authMiddleware } from "../middleware/auth.ts";
import { upload } from "../middleware/multer.ts";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createTask);
router.get("/project/:projectId", getTasksByProject);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.post("/:id/comments", addComment);
router.post("/:id/subtasks", addSubtask);
router.put("/:id/subtasks/toggle", toggleSubtask);
router.post("/:id/attachments", upload.single("file"), uploadAttachment);

export default router;
