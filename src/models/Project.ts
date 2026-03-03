import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    projectCode: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["Active", "Completed", "On Hold", "Archived"],
      default: "Active",
    },
    deadline: { type: Date },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);
