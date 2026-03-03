import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./src/models/User.ts";
import { Project } from "./src/models/Project.ts";
import { Task } from "./src/models/Task.ts";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});

    // Create Admin User
    const admin = new User({
      name: "Admin User",
      email: "admin@promanage.com",
      password: "password123",
      role: "Admin",
      avatar: "https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff"
    });
    await admin.save();

    // Create Manager User
    const manager = new User({
      name: "Project Manager",
      email: "manager@promanage.com",
      password: "password123",
      role: "Manager",
      avatar: "https://ui-avatars.com/api/?name=Project+Manager&background=f59e0b&color=fff"
    });
    await manager.save();

    // Create Member User
    const member = new User({
      name: "Team Member",
      email: "member@promanage.com",
      password: "password123",
      role: "Member",
      avatar: "https://ui-avatars.com/api/?name=Team+Member&background=10b981&color=fff"
    });
    await member.save();

    // Create Sample Project
    const project = new Project({
      name: "Website Redesign 2024",
      description: "Complete overhaul of the company landing page and customer portal.",
      code: "WEB24",
      status: "Active",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      owner: manager._id,
      members: [manager._id, member._id, admin._id]
    });
    await project.save();

    // Create Sample Tasks
    const tasks = [
      {
        title: "Design System Implementation",
        description: "Create a consistent set of UI components and styles.",
        project: project._id,
        assignedTo: member._id,
        priority: "High",
        status: "In Progress",
        subtasks: [
          { title: "Define color palette", completed: true },
          { title: "Choose typography", completed: true },
          { title: "Design buttons and inputs", completed: false }
        ]
      },
      {
        title: "Backend API Integration",
        description: "Connect the frontend with the new Express API endpoints.",
        project: project._id,
        assignedTo: manager._id,
        priority: "Medium",
        status: "Todo",
        subtasks: [
          { title: "Auth routes", completed: false },
          { title: "Project CRUD", completed: false }
        ]
      },
      {
        title: "User Testing",
        description: "Gather feedback from initial stakeholders.",
        project: project._id,
        assignedTo: admin._id,
        priority: "Low",
        status: "Todo"
      }
    ];

    for (const taskData of tasks) {
      const task = new Task(taskData);
      await task.save();
    }

    console.log("Seed data created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedData();
