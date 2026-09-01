const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 3000,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Academics",
        "Hostel",
        "Faculty",
        "Facilities",
        "Administration",
        "IT & Network",
        "Harassment",
        "Other",
      ],
      default: "Other",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adminRemarks: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ["Pending", "In Progress", "Resolved", "Rejected"],
        },
        changedAt: { type: Date, default: Date.now },
        note: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

complaintSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Complaint", complaintSchema);
