// Resets the password of the existing admin account (ADMIN_EMAIL in .env)
// to the current ADMIN_PASSWORD value. Use this when the admin account
// already existed and re-running seed:admin didn't change its password.
//
// Run:  node seed/resetAdminPassword.js
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const User = require("../models/User");

dotenv.config();

const run = async () => {
  await connectDB();

  const email = (process.env.ADMIN_EMAIL || "admin@institution.edu").toLowerCase();
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    console.log(`No account found with email "${email}". Run npm run seed:admin instead.`);
    process.exit(1);
  }

  user.password = process.env.ADMIN_PASSWORD || "ChangeThisPassword123!";
  user.role = "admin";
  user.status = "active";
  await user.save(); // pre-save hook hashes the new password

  console.log(`Password for "${email}" has been reset to the value in ADMIN_PASSWORD.`);
  process.exit(0);
};

run().catch((err) => {
  console.error("Failed to reset admin password:", err.message);
  process.exit(1);
});