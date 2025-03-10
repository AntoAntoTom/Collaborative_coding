import mongoose, { Schema, model } from "mongoose";

export interface ProjectDocument {
  _id: string;
  name: string;
  clientName: string;
  description: string;
  startDate: Date;
  endDate: Date;
  priority: "Low" | "Medium" | "High" | "Critical";
  technologyStack: string;
  budget: number;
  teamMembers: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  status: "Planning" | "In Progress" | "Completed" | "On Hold";
}

const ProjectSchema = new Schema<ProjectDocument>(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      maxlength: [100, "Project name cannot exceed 100 characters"]
    },
    clientName: {
      type: String,
      trim: true,
      maxlength: [100, "Client name cannot exceed 100 characters"]
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"]
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"]
    },
    endDate: {
      type: Date
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium"
    },
    technologyStack: {
      type: String,
      trim: true
    },
    budget: {
      type: Number,
      min: [0, "Budget cannot be negative"],
      default: 0
    },
    teamMembers: {
      type: [String],
      default: []
    },
    createdBy: {
      type: String,
      ref: "User",
      required: [true, "Creator is required"]
    },
    status: {
      type: String,
      enum: ["Planning", "In Progress", "Completed", "On Hold"],
      default: "Planning"
    }
  },
  {
    timestamps: true
  }
);

const Project = mongoose.models?.Project || model<ProjectDocument>("Project", ProjectSchema);

export default Project;