import { Project } from "../models/Project.ts";
import { Task } from "../models/Task.ts";
import { User } from "../models/User.ts";

export const getDashboardStats = async (req: any, res: any) => {
  try {
    const userId = req.user._id;

    // Projects count
    const activeProjectsCount = await Project.countDocuments({ 
      members: userId, 
      status: "Active" 
    });

    // Tasks stats
    const tasks = await Task.find({ 
      project: { $in: await Project.find({ members: userId }).distinct("_id") } 
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "Completed").length;
    const pendingTasks = tasks.filter(t => t.status !== "Completed").length;
    
    const now = new Date();
    const overdueTasks = tasks.filter(t => 
      t.status !== "Completed" && t.dueDate && new Date(t.dueDate) < now
    ).length;

    // Task distribution for Pie Chart
    const distribution = {
      todo: tasks.filter(t => t.status === "Todo").length,
      inProgress: tasks.filter(t => t.status === "In Progress").length,
      completed: completedTasks
    };

    // Weekly activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const weeklyTasks = await Task.find({
      project: { $in: await Project.find({ members: userId }).distinct("_id") },
      createdAt: { $gte: sevenDaysAgo }
    });

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyActivity = days.map(day => {
      const count = weeklyTasks.filter(t => {
        const d = new Date(t.createdAt);
        return days[d.getDay()] === day;
      }).length;
      return { name: day, tasks: count };
    });

    res.json({
      stats: {
        activeProjects: activeProjectsCount,
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks
      },
      distribution,
      weeklyActivity
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeamPerformance = async (req: any, res: any) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId).populate("members", "name avatar");
    if (!project) return res.status(404).json({ message: "Project not found" });

    const tasks = await Task.find({ project: projectId });

    const performance = project.members.map((member: any) => {
      const memberTasks = tasks.filter(t => t.assignedTo?.toString() === member._id.toString());
      const completed = memberTasks.filter(t => t.status === "Completed").length;
      return {
        name: member.name,
        avatar: member.avatar,
        total: memberTasks.length,
        completed,
        efficiency: memberTasks.length > 0 ? Math.round((completed / memberTasks.length) * 100) : 0
      };
    });

    res.json(performance);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
