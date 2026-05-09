const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/upload");
const { scanWine, updateStatus, removeWine, listWines, getWine } = require("../controllers/wineController");

router.post("/scan", upload.single("image"), scanWine);
router.get("/", listWines);
router.get("/:id", getWine);
router.patch("/:id/status", updateStatus);   // move cellar ↔ wishlist
router.delete("/:id", removeWine);           // hard delete
module.exports = router;