const sharp = require("sharp");

const TARGET_WIDTH = 1024; // px — wide enough for label detail, cheap for the API
const JPEG_QUALITY = 82; // good balance between fidelity and size

/**
 * Compresses and resizes an image buffer for Vision API consumption.
 *
 * Strategy:
 *  - Resize to at most TARGET_WIDTH wide (portrait bottles stay tall).
 *  - Convert to JPEG regardless of source format (HEIC, PNG, WebP → JPEG).
 *  - Strip EXIF to remove GPS data and shrink payload further.
 *
 * @param {Buffer} inputBuffer  Raw image bytes from multer memory storage.
 * @returns {Promise<{ buffer: Buffer, mimeType: string }>}
 */
async function optimizeImage(inputBuffer) {
  try {
    const buffer = await sharp(inputBuffer)
      .rotate() // auto-orient from EXIF before stripping it
      .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .withMetadata(false) // strip EXIF / GPS
      .toBuffer();

    return { buffer, mimeType: "image/jpeg" };
  } catch (err) {
    throw new Error(`Image optimisation failed: ${err.message}`);
  }
}

module.exports = { optimizeImage };
