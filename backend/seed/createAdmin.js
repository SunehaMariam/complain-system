// Creates the initial authorized administrator account.
// Run once after setting up your .env file:  npm run seed:admin
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const User = require("../models/User");

dotenv.config();

const run = async () => {
  await connectDB();

  const email = (process.env.ADMIN_EMAIL || "admin@institution.edu").toLowerCase();
  const existing = await User.findOne({ email });

  if (existing) {
    existing.role = "admin";
    existing.status = "active";
    await existing.save();
    console.log(`Existing account "${email}" promoted to an active admin.`);
    process.exit(0);
  }

  const admin = await User.create({
    name: process.env.ADMIN_NAME || "System Admin",
    email,
    password: process.env.ADMIN_PASSWORD || "ChangeThisPassword123!",
    role: "admin",
    status: "active",
  });

  console.log("Initial admin account created:");
  console.log(`  Email:    ${admin.email}`);
  console.log(`  Password: ${process.env.ADMIN_PASSWORD || "ChangeThisPassword123!"}`);
  console.log("Please log in and change this password immediately.");
  process.exit(0);
};

run().catch((err) => {
  console.error("Failed to seed admin:", err.message);
  process.exit(1);
});
