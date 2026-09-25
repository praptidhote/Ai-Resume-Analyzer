const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("[Database] MONGO_URI is missing in environment variables (.env).");
      return;
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      tlsAllowInvalidCertificates: true,
    });

    console.log("✓ MongoDB connected successfully");
  } catch (error) {
    console.error("✗ MongoDB connection failed:");
    console.error(`  Reason: ${error.message}`);
    if (error.message.includes("Could not connect to any servers")) {
      console.warn("\n  👉 IP Whitelist Reminder:");
      console.warn("  Your MongoDB Atlas cluster requires your IP to be whitelisted.");
      console.warn("  Go to: MongoDB Atlas Dashboard -> Network Access -> Add IP Address (e.g. 0.0.0.0/0 for all or your current IP).\n");
    }
  }
};

module.exports = connectDB;