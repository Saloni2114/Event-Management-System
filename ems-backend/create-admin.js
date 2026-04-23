const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/event-management");

async function createAdminUser() {
  try {
    const adminEmail = "admin@ems.com";
    const adminPassword = "admin123";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("✅ Admin user already exists:", existingAdmin.email);
      console.log("Role:", existingAdmin.role);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const adminUser = await User.create({
      name: "Admin User",
      email: adminEmail,
      password: hashedPassword,
      role: "admin"
    });

    console.log("🎉 Admin user created successfully!");
    console.log("Email:", adminUser.email);
    console.log("Password:", adminPassword);
    console.log("Role:", adminUser.role);
    console.log("\n🔐 Use these credentials to login as admin");

  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
  } finally {
    mongoose.connection.close();
  }
}

// Run the script
createAdminUser();