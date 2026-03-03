import { Project } from "../models/Project.ts";
import { User } from "../models/User.ts";
import { Notification } from "../models/Notification.ts";
import { sendEmail } from "../utils/emailService.ts";
import crypto from "crypto";

const generateProjectCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  const length = Math.floor(Math.random() * 3) + 6; // 6, 7, or 8
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const createProject = async (req: any, res: any) => {
  try {
    const { name, description, deadline } = req.body;
    
    let projectCode: string = "";
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      projectCode = generateProjectCode();
      const existingProject = await Project.findOne({ projectCode });
      if (!existingProject) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw new Error("Failed to generate a unique project code. Please try again.");
    }
    
    const project = new Project({
      name,
      description,
      deadline,
      projectCode,
      owner: req.user._id,
      members: [req.user._id],
    });

    await project.save();
    console.log("Project saved with code:", project.projectCode);
    res.status(201).json(project);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const inviteMember = async (req: any, res: any) => {
  try {
    const { email, projectId } = req.body;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // In a real app, we'd check if user exists, if not send a different email
    const user = await User.findOne({ email });
    
    const inviteLink = `${process.env.APP_URL}/projects/join?code=${project.projectCode}`;
    const html = `
      <h1>Project Invitation</h1>
      <p>You have been invited to join the project: <strong>${project.name}</strong></p>
      <p>Use the code below to join:</p>
      <h2 style="background: #f4f4f4; padding: 10px; display: inline-block;">${project.projectCode}</h2>
      <br/>
      <a href="${inviteLink}" style="background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Join Project</a>
    `;

    await sendEmail(email, `Invitation to join ${project.name}`, html);

    if (user) {
      const notification = new Notification({
        recipient: user._id,
        sender: req.user._id,
        type: "Project Invitation",
        message: `You have been invited to join project: ${project.name}`,
        link: `/projects`,
      });
      await notification.save();
    }

    res.json({ message: "Invitation sent successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjects = async (req: any, res: any) => {
  try {
    const projects = await Project.find({ members: req.user._id })
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar");
    console.log("Fetched projects count:", projects.length);
    if (projects.length > 0) {
      console.log("First project code:", projects[0].projectCode);
    }
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req: any, res: any) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar");
    if (!project) return res.status(404).json({ message: "Project not found" });
    console.log("Fetched project by ID code:", project.projectCode);
    res.json(project);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const joinProject = async (req: any, res: any) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: "Project code is required" });

    const project = await Project.findOne({ projectCode: code.toUpperCase() });
    if (!project) return res.status(404).json({ message: "Invalid project code" });

    if (project.members.includes(req.user._id)) {
      return res.status(400).json({ message: "Already a member of this project" });
    }

    project.members.push(req.user._id);
    await project.save();
    console.log("Joined project code:", project.projectCode);
    res.json(project);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req: any, res: any) => {
  try {
    const { name, description, deadline, status } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.owner.toString() !== req.user._id.toString() && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Unauthorized to update this project" });
    }

    if (name) project.name = name;
    if (description) project.description = description;
    if (deadline) project.deadline = deadline;
    if (status) project.status = status;

    await project.save();
    console.log("Updated project code:", project.projectCode);
    res.json(project);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req: any, res: any) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.owner.toString() !== req.user._id.toString() && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Unauthorized to delete this project" });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const removeMember = async (req: any, res: any) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.owner.toString() !== req.user._id.toString() && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Unauthorized to remove members" });
    }

    project.members = project.members.filter((m: any) => m.toString() !== userId);
    await project.save();
    console.log("Removed member, project code:", project.projectCode);
    res.json(project);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
