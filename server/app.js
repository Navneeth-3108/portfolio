const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const projectRoutes = require("./routes/projectRoutes");
const skillRoutes = require("./routes/skillRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const educationRoutes = require("./routes/educationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const personalDetailsRoutes = require("./routes/personalDetailsRoutes");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const { notFoundHandler, errorHandler } = require("./middlewares/errorHandler");
const { sendSuccess } = require("./utils/response");

const app = express();

app.use(helmet());

const normalizeOrigin = (origin = "") => origin.replace(/\/$/, "");

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => normalizeOrigin(origin.trim()))
  .filter(Boolean);

const hasWildcardOrigin = allowedOrigins.includes("*");

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser clients and same-origin server-to-server calls.
    if (!origin) return callback(null, true);

    if (process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }

    if (hasWildcardOrigin) {
      return callback(null, true);
    }

    const normalizedRequestOrigin = normalizeOrigin(origin);
    const isAllowed = allowedOrigins.includes(normalizedRequestOrigin);

    if (isAllowed) {
      return callback(null, true);
    }

    // Deny CORS without surfacing as server error spam in logs.
    return callback(null, false);
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  return sendSuccess(res, 200, "Portfolio API is running", {
    status: "ok",
  });
});

app.get("/health", (_req, res) => {

  return sendSuccess(res, 200, "Health check successful", { status: "ok" });
});

app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/personal-details", personalDetailsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
