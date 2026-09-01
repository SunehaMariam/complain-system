const User = require("../models/User");

// @route  GET /api/users?status=pending
// @desc   Admin: list all users, optionally filtered by status
const getUsers = async (req, res) => {
  try {
    const { status, role, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ users: users.map((u) => u.toSafeObject()) });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

// @route  GET /api/users/stats
const getUserStats = async (req, res) => {
  try {
    const [total, pending, active, deactivated, rejected, admins] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: "pending" }),
      User.countDocuments({ status: "active" }),
      User.countDocuments({ status: "deactivated" }),
      User.countDocuments({ status: "rejected" }),
      User.countDocuments({ role: "admin" }),
    ]);
    return res.status(200).json({ total, pending, active, deactivated, rejected, admins });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch user stats", error: error.message });
  }
};

// @route  PATCH /api/users/:id/approve
const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = "active";
    await user.save();

    return res.status(200).json({ message: "User approved", user: user.toSafeObject() });
  } catch (error) {
    return res.status(500).json({ message: "Failed to approve user", error: error.message });
  }
};

// @route  PATCH /api/users/:id/reject
const rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = "rejected";
    await user.save();

    return res.status(200).json({ message: "User rejected", user: user.toSafeObject() });
  } catch (error) {
    return res.status(500).json({ message: "Failed to reject user", error: error.message });
  }
};

// @route  PATCH /api/users/:id/toggle-active
// @desc   Activate a deactivated user, or deactivate an active one.
const toggleActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin" && req.user.id === String(user._id)) {
      return res.status(400).json({ message: "You cannot deactivate your own admin account" });
    }

    user.status = user.status === "deactivated" ? "active" : "deactivated";
    await user.save();

    return res.status(200).json({
      message: `User ${user.status === "deactivated" ? "deactivated" : "activated"}`,
      user: user.toSafeObject(),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update user status", error: error.message });
  }
};

// @route  PATCH /api/users/:id/role
// @desc   Promote/demote a user between "user" and "admin"
const changeRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Role must be either 'user' or 'admin'" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.user.id === String(user._id) && role === "user") {
      return res.status(400).json({ message: "You cannot demote your own account" });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({ message: "User role updated", user: user.toSafeObject() });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update role", error: error.message });
  }
};

module.exports = { getUsers, getUserStats, approveUser, rejectUser, toggleActive, changeRole };
