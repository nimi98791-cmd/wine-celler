const { optimizeImage } = require("../services/imageService");
const { analyzeWineImage } = require("../services/visionService");
const { insertWine, getAllWines, getWineById } = require("../models/wineModel");

/**
 * POST /api/wines/scan
 *
 * Pipeline:
 *  1. Validate upload exists
 *  2. Optimise image with Sharp
 *  3. Send to Gemini Vision → get structured JSON
 *  4. Insert into Supabase
 *  5. Return the saved record
 */
async function scanWine(req, res) {
  // 1. File presence check (multer puts it on req.file)
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: "No image file uploaded. Send a JPEG, PNG, WebP, or HEIC file under the field name 'image'.",
    });
  }

  try {
    // 2. Optimise
    const { buffer: optimizedBuffer, mimeType } = await optimizeImage(
      req.file.buffer
    );

    // 3. Vision API
    const wineData = await analyzeWineImage(optimizedBuffer, mimeType);

    // 4. Persist
    const savedWine = await insertWine(wineData);

    // 5. Respond
    return res.status(201).json({
      success: true,
      message: "Wine scanned and saved successfully.",
      data: savedWine,
    });
  } catch (err) {
    return handleError(err, res);
  }
}

/**
 * GET /api/wines
 * Returns all wines from the cellar, newest first.
 */
async function listWines(req, res) {
  try {
    const wines = await getAllWines();
    return res.status(200).json({ success: true, data: wines });
  } catch (err) {
    return handleError(err, res);
  }
}

/**
 * GET /api/wines/:id
 * Returns a single wine record.
 */
async function getWine(req, res) {
  try {
    const wine = await getWineById(req.params.id);
    if (!wine) {
      return res.status(404).json({ success: false, error: "Wine not found." });
    }
    return res.status(200).json({ success: true, data: wine });
  } catch (err) {
    return handleError(err, res);
  }
}

// ─── Centralised error handler ────────────────────────────────────────────────
function handleError(err, res) {
  console.error(`[WineController] ${err.message}`, err.stack);

  // Friendly messages for known error codes
  const knownErrors = {
    UNREADABLE_LABEL: {
      status: 422,
      error: "The wine label could not be read. Please upload a clearer photo.",
    },
    DB_INSERT_ERROR: {
      status: 503,
      error: "The wine was identified but could not be saved. Please try again.",
    },
  };

  if (err.code && knownErrors[err.code]) {
    const { status, error } = knownErrors[err.code];
    return res.status(status).json({ success: false, error });
  }

  // Multer file-size error
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      success: false,
      error: "Image exceeds the 10 MB size limit.",
    });
  }

  // Gemini / image processing / validation errors → 422
  if (
    err.message.includes("Vision API") ||
    err.message.includes("Image optimis") ||
    err.message.includes("missing or invalid field") ||
    err.message.includes("Invalid wine type") ||
    err.message.includes("Invalid vintage")
  ) {
    return res.status(422).json({ success: false, error: err.message });
  }

  // Fallback
  return res.status(500).json({
    success: false,
    error: "An unexpected error occurred. Please try again.",
  });
}

module.exports = { scanWine, listWines, getWine };
