import { Task } from "../models/Task.ts";
import { Notification } from "../models/Notification.ts";

export const createTask = async (req: any, res: any) => {
  try {
    const { title, description, project, assignedTo, priority, dueDate } = req.body;
    const task = new Task({
      title,
      description,
      project,
      assignedTo,
      priority,
      dueDate,
    });

    await task.save();

    if (assignedTo) {
      const notification = new Notification({
        recipient: assignedTo,
        sender: req.user._id,
        type: "Task Assigned",
        message: `You have been assigned a new task: ${title}`,
        link: `/projects/${project}/tasks/${task._id}`,
      });
      await notification.save();
    }

    res.status(201).json(task);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasksByProject = async (req: any, res: any) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate("assignedTo", "name email avatar")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req: any, res: any) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req: any, res: any) => {
  try {
    const { text } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.comments.push({ user: req.user._id, text });
    await task.save();

    // Notify assigned user if someone else comments
    if (task.assignedTo && task.assignedTo.toString() !== req.user._id.toString()) {
      const notification = new Notification({
        recipient: task.assignedTo,
        sender: req.user._id,
        type: "Comment",
        message: `${req.user.name} commented on your task: ${task.title}`,
        link: `/projects/${task.project}/tasks/${task._id}`,
      });
      await notification.save();
    }

    res.json(task);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req: any, res: any) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addSubtask = async (req: any, res: any) => {
  try {
    const { title } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.subtasks.push({ title, completed: false });
    await task.save();
    res.json(task);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleSubtask = async (req: any, res: any) => {
  try {
    const { subtaskId } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const subtask = (task.subtasks as any).id(subtaskId);
    if (!subtask) return res.status(404).json({ message: "Subtask not found" });

    subtask.completed = !subtask.completed;
    await task.save();
    res.json(task);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadAttachment = async (req: any, res: any) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.attachments.push({
      name: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      type: req.file.mimetype,
    });

    await task.save();
    res.json(task);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
