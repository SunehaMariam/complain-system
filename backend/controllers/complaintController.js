const { validationResult } = require("express-validator");
const Complaint = require("../models/Complaint");

// @route  POST /api/complaints
// @desc   User: submit a new complaint
const createComplaint = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
  }

  try {
    const { title, description, category, priority } = req.body;

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      user: req.user._id,
      statusHistory: [{ status: "Pending", note: "Complaint submitted" }],
    });

    return res.status(201).json({ message: "Complaint submitted successfully", complaint });
  } catch (error) {
    return res.status(500).json({ message: "Failed to submit complaint", error: error.message });
  }
};

// @route  GET /api/complaints/mine
// @desc   User: view their own complaints
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ complaints });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch complaints", error: error.message });
  }
};

// @route  GET /api/complaints
// @desc   Admin: view all complaints, with search + filters
const getAllComplaints = async (req, res) => {
  try {
    const { status, category, priority, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const complaints = await Complaint.find(filter)
      .populate("user", "name email department")
      .sort({ createdAt: -1 });

    return res.status(200).json({ complaints });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch complaints", error: error.message });
  }
};

// @route  GET /api/complaints/stats
// @desc   Admin: dashboard statistics
const getComplaintStats = async (req, res) => {
  try {
    const [total, pending, inProgress, resolved, rejected] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: "Pending" }),
      Complaint.countDocuments({ status: "In Progress" }),
      Complaint.countDocuments({ status: "Resolved" }),
      Complaint.countDocuments({ status: "Rejected" }),
    ]);

    const byCategory = await Complaint.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return res.status(200).json({
      total,
      pending,
      inProgress,
      resolved,
      rejected,
      byCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch stats", error: error.message });
  }
};

// @route  GET /api/complaints/:id
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      "user",
      "name email department"
    );
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    const isOwner = String(complaint.user._id) === String(req.user._id);
    if (req.user.role !== "admin" && !isOwner) {
      return res.status(403).json({ message: "You are not authorized to view this complaint" });
    }

    return res.status(200).json({ complaint });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch complaint", error: error.message });
  }
};

// @route  PUT /api/complaints/:id
// @desc   User: edit their own complaint (only while it is still Pending)
const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    if (String(complaint.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only edit your own complaints" });
    }

    if (complaint.status !== "Pending") {
      return res.status(400).json({
        message: "This complaint is already being processed and can no longer be edited",
      });
    }

    const { title, description, category, priority } = req.body;
    if (title) complaint.title = title;
    if (description) complaint.description = description;
    if (category) complaint.category = category;
    if (priority) complaint.priority = priority;

    await complaint.save();
    return res.status(200).json({ message: "Complaint updated", complaint });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update complaint", error: error.message });
  }
};

// @route  DELETE /api/complaints/:id
// @desc   User: delete their own complaint (only while still Pending)
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    if (String(complaint.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only delete your own complaints" });
    }

    if (complaint.status !== "Pending") {
      return res.status(400).json({
        message: "This complaint is already being processed and can no longer be deleted",
      });
    }

    await complaint.deleteOne();
    return res.status(200).json({ message: "Complaint deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete complaint", error: error.message });
  }
};

// @route  PATCH /api/complaints/:id/status
// @desc   Admin: update complaint status through its lifecycle
const updateStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const allowed = ["Pending", "In Progress", "Resolved", "Rejected"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    complaint.status = status;
    if (remarks !== undefined) complaint.adminRemarks = remarks;
    if (status === "Resolved") complaint.resolvedAt = new Date();
    complaint.statusHistory.push({ status, note: remarks || "" });

    await complaint.save();
    return res.status(200).json({ message: "Complaint status updated", complaint });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update status", error: error.message });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintStats,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  updateStatus,
};
