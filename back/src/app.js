const express = require("express");
const cors = require("cors"); 
const wineRoutes = require("./routes/wineRoutes");

const app = express();
app.use(cors()); 

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Welcome Route ──────────────────────────────
app.get("/", (req, res) => {
  res.json({ success: true, message: "Wine Cellar API is up and running!" });
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── API routes ────────────────────────────────────────────────────────────────
app.use("/api/wines", wineRoutes);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found.` });
});

// ── Global error handler (catches errors from middleware, e.g. multer) ────────
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ success: false, error: "Image exceeds the 10 MB size limit." });
  }
  if (err.message && err.message.startsWith("Unsupported file type")) {
    return res.status(415).json({ success: false, error: err.message });
  }
  console.error("[Global] Unhandled error:", err);
  res.status(500).json({ success: false, error: "An unexpected server error occurred." });
});

module.exports = app;
