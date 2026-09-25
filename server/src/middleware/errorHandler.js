const errorHandler = (err, req, res, next) => {
  console.error("Error encountered:", err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join(", "),
    });
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `An account with that ${field} already exists.`,
    });
  }

  // Multer errors
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size exceeds 5MB limit. Please upload a smaller file.",
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid authentication token. Please log in again.",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Session expired. Please log in again.",
    });
  }

  // Mongoose connection timeout / buffering error
  if (err.name === "MongooseError" && err.message.includes("buffering timed out")) {
    return res.status(503).json({
      success: false,
      message:
        "Database is not reachable. Please make sure your current IP address is whitelisted in your MongoDB Atlas cluster (Security > Network Access > Allow Access From Anywhere: 0.0.0.0/0).",
    });
  }

  // Generic fallback
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

module.exports = errorHandler;
