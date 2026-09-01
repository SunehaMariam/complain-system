const express = require("express");
const { protect, requireActive } = require("../middleware/auth");
const authorize = require("../middleware/role");
const {
  getUsers,
  getUserStats,
  approveUser,
  rejectUser,
  toggleActive,
  changeRole,
} = require("../controllers/userController");

const router = express.Router();

// All routes below are admin-only
router.use(protect, requireActive, authorize("admin"));

router.get("/", getUsers);
router.get("/stats", getUserStats);
router.patch("/:id/approve", approveUser);
router.patch("/:id/reject", rejectUser);
router.patch("/:id/toggle-active", toggleActive);
router.patch("/:id/role", changeRole);

module.exports = router;
