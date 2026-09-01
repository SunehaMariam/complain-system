const express = require("express");
const { body } = require("express-validator");
const { protect, requireActive } = require("../middleware/auth");
const authorize = require("../middleware/role");
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintStats,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  updateStatus,
} = require("../controllers/complaintController");

const router = express.Router();

router.use(protect, requireActive);

const complaintValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("category").notEmpty().withMessage("Category is required"),
];

// User routes
router.post("/", complaintValidation, createComplaint);
router.get("/mine", getMyComplaints);
router.put("/:id", updateComplaint);
router.delete("/:id", deleteComplaint);

// Admin routes
router.get("/", authorize("admin"), getAllComplaints);
router.get("/stats", authorize("admin"), getComplaintStats);
router.patch("/:id/status", authorize("admin"), updateStatus);

// Shared (owner or admin — checked inside controller)
router.get("/:id", getComplaintById);

module.exports = router;
