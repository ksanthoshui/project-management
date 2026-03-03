import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Todo", "In Progress", "Completed"],
      default: "Todo",
    },
    dueDate: { type: Date },
    subtasks: [
      {
        title: { type: String, required: true },
        completed: { type: Boolean, default: false },
      },
    ],
    attachments: [
      {
        name: { type: String },
        url: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    checklist: [
      {
        item: { type: String, required: true },
        completed: { type: Boolean, default: false },
      },
    ],
    progress: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-calculate progress based on subtasks
taskSchema.pre("save", function (this: any) {
  if (this.subtasks.length > 0) {
    const completed = this.subtasks.filter((s: any) => s.completed).length;
    this.progress = Math.round((completed / this.subtasks.length) * 100);
  } else if (this.status === "Completed") {
    this.progress = 100;
  }
});

export const Task = mongoose.model("Task", taskSchema);
