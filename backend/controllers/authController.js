const { validationResult } = require("express-validator");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @route  POST /api/auth/register
// @desc   Register a new account. New accounts always start as role "user"
//         and status "pending" — they cannot self-approve or self-promote.
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
  }

  try {
    const { name, email, password, department } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      department,
      role: "user",
      status: "pending",
    });

    return res.status(201).json({
      message: "Account created. Please wait for administrator approval before logging in.",
      user: user.toSafeObject(),
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// @route  POST /api/auth/login
// @desc   Single login for both users and admins. Role is detected from the
//         stored account, not chosen by the client.
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.status === "pending") {
      return res.status(403).json({
        message: "Your account is pending administrator approval.",
        status: "pending",
      });
    }

    if (user.status === "rejected") {
      return res.status(403).json({
        message: "Your account registration was rejected by an administrator.",
        status: "rejected",
      });
    }

    if (user.status === "deactivated") {
      return res.status(403).json({
        message: "Your account has been deactivated. Contact an administrator.",
        status: "deactivated",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// @route  GET /api/auth/me
const getMe = async (req, res) => {
  return res.status(200).json({ user: req.user.toSafeObject() });
};

module.exports = { register, login, getMe };
