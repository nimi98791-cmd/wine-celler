const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/upload");
const { scanWine, listWines, getWine } = require("../controllers/wineController");

// POST /api/wines/scan  — upload & analyse a wine bottle image
router.post("/scan", upload.single("image"), scanWine);

// GET /api/wines        — list all wines in the cellar
router.get("/", listWines);

// GET /api/wines/:id    — get a single wine by UUID
router.get("/:id", getWine);

module.exports = router;
