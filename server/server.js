import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

import connectDB from "./config/db.js";
import reportRoutes from "./routes/reportRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// --- Core middleware ---
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded complaint images at the URLs stored in Report.image.url (e.g. /uploads/report-...jpg)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Health check ---
app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// --- API routes ---
app.use("/api/report", reportRoutes);
app.use("/api/ai", aiRoutes);

// --- 404 handler (no route matched) ---
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// --- Centralized error handler (must be registered last) ---
app.use(errorHandler);

// --- Startup ---
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[server] SmartCitizen AI API running on port ${PORT}`);
  });
}

startServer();

// Catch anything that slips past try/catch blocks instead of crashing silently.
process.on("unhandledRejection", (reason) => {
  console.error("[server] Unhandled promise rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("[server] Uncaught exception:", error);
  process.exit(1);
});