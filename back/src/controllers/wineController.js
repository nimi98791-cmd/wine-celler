const { optimizeImage } = require("../services/imageService");
const { analyzeWineImage } = require("../services/visionService");
const { insertWine, updateWineStatus, deleteWine, getAllWines, getWineById } = require("../models/wineModel");

// POST /api/wines/scan
async function scanWine(req, res) {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "No image file uploaded." });
  }
  // Accept optional status from body: 'cellar' (default) or 'wishlist'
  const status = req.body.status === "wishlist" ? "wishlist" : "cellar";

  try {
    const { buffer, mimeType } = await optimizeImage(req.file.buffer);
    const wineData = await analyzeWineImage(buffer, mimeType);
    const savedWine = await insertWine(wineData, status);
    return res.status(201).json({ success: true, data: savedWine });
  } catch (err) {
    return handleError(err, res);
  }
}

// PATCH /api/wines/:id/status
async function updateStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  if (!["cellar", "wishlist"].includes(status)) {
    return res.status(400).json({ success: false, error: "status must be 'cellar' or 'wishlist'." });
  }
  try {
    const updated = await updateWineStatus(id, status);
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    return handleError(err, res);
  }
}

// DELETE /api/wines/:id
async function removeWine(req, res) {
  const { id } = req.params;
  try {
    await deleteWine(id);
    return res.status(200).json({ success: true, message: "Wine deleted." });
  } catch (err) {
    return handleError(err, res);
  }
}

// GET /api/wines
async function listWines(req, res) {
  try {
    const wines = await getAllWines();
    return res.status(200).json({ success: true, data: wines });
  } catch (err) {
    return handleError(err, res);
  }
}

// GET /api/wines/:id
async function getWine(req, res) {
  try {
    const wine = await getWineById(req.params.id);
    if (!wine) return res.status(404).json({ success: false, error: "Wine not found." });
    return res.status(200).json({ success: true, data: wine });
  } catch (err) {
    return handleError(err, res);
  }
}

function handleError(err, res) {
  console.error(`[WineController] ${err.message}`);
  if (err.code === "UNREADABLE_LABEL") return res.status(422).json({ success: false, error: "The wine label could not be read. Please upload a clearer photo." });
  if (err.code === "DB_INSERT_ERROR") return res.status(503).json({ success: false, error: "Wine identified but could not be saved. Please try again." });
  if (err.code === "LIMIT_FILE_SIZE") return res.status(413).json({ success: false, error: "Image exceeds the 10 MB size limit." });
  return res.status(500).json({ success: false, error: "An unexpected error occurred." });
}

module.exports = { scanWine, updateStatus, removeWine, listWines, getWine };