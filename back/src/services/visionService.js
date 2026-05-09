const { GoogleGenerativeAI } = require("@google/generative-ai");

// ─── System prompt ────────────────────────────────────────────────────────────
// Strict JSON-only instruction. Gemini 1.5 Flash respects this reliably when
// combined with responseMimeType: "application/json".
const SYSTEM_PROMPT = `
You are a professional sommelier and wine expert with encyclopaedic knowledge of wines worldwide.

Your task: analyse the wine bottle label in the image and extract the following information.

Return ONLY a single valid JSON object — no markdown, no code fences, no explanation, no preamble.
Use exactly these keys:

{
  "wine_name":         "<Full name of the wine as printed on the label>",
  "winery":            "<Producer / winery name>",
  "vintage":           <4-digit year as a number, or null if not visible>,
  "type":              "<One of: Red | White | Rosé | Sparkling | Dessert | Fortified | Orange>",
  "characteristics":   "<Tasting notes and style description. Be precise and sensory: e.g. 'Deep and fruity with notes of peach, apricot, and white flowers, finishing with a rich, honeyed texture' for a Viognier or Chenin Blanc.>",
  "estimated_price":   <Retail price in USD as a number, no currency symbol>,
  "rating_out_of_100": <Critic-style score 80–100 as a number>,
  "aging_potential":   "<Plain-English explanation of how many years this wine can cellar and when it peaks>",
  "drink_now":         <true if optimal to drink within the next 2 years, false if benefits from more cellaring>
}

Rules:
- All string values must be non-empty.
- If the label is unreadable or the image is not a wine bottle, return exactly: {"error": "unreadable_label"}
- Do NOT wrap the JSON in markdown or add any text outside the JSON object.
`.trim();

// ─── Model config ─────────────────────────────────────────────────────────────
const MODEL_NAME = "gemini-1.5-flash-latest";

let genAI;
function getClient() {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is not set.");
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

/**
 * Sends a compressed image buffer to Gemini 1.5 Flash and returns a parsed
 * wine-data object.
 *
 * @param {Buffer} imageBuffer  Compressed JPEG from imageService.
 * @param {string} mimeType     Should be "image/jpeg".
 * @returns {Promise<object>}   Validated wine JSON object.
 */
async function analyzeWineImage(imageBuffer, mimeType) {
  const model = getClient().getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: "application/json", // force JSON output at the API level
      temperature: 0.2,                     // low temp = more deterministic extraction
      maxOutputTokens: 1024,
    },
  });

  const imagePart = {
    inlineData: {
      data: imageBuffer.toString("base64"),
      mimeType,
    },
  };

  let result;
  try {
    result = await model.generateContent([
      "Analyse this wine bottle label and return the JSON as instructed.",
      imagePart,
    ]);
  } catch (err) {
    throw new Error(`Gemini API call failed: ${err.message}`);
  }

  const rawText = result.response.text().trim();

  // ── Parse & validate ────────────────────────────────────────────────────────
  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error(
      `Vision API returned non-JSON output: ${rawText.slice(0, 200)}`
    );
  }

  // Gemini signalled the label was unreadable
  if (parsed.error === "unreadable_label") {
    const e = new Error("The wine label could not be read from the image.");
    e.code = "UNREADABLE_LABEL";
    throw e;
  }

  validateWineSchema(parsed);
  return parsed;
}

// ─── Schema validation ────────────────────────────────────────────────────────
const REQUIRED_STRING_FIELDS = [
  "wine_name",
  "winery",
  "type",
  "characteristics",
  "aging_potential",
];

const VALID_TYPES = ["Red", "White", "Rosé", "Sparkling", "Dessert", "Fortified", "Orange"];

function validateWineSchema(obj) {
  for (const field of REQUIRED_STRING_FIELDS) {
    if (typeof obj[field] !== "string" || obj[field].trim() === "") {
      throw new Error(`Vision API response missing or invalid field: ${field}`);
    }
  }

  if (!VALID_TYPES.includes(obj.type)) {
    throw new Error(
      `Invalid wine type "${obj.type}". Must be one of: ${VALID_TYPES.join(", ")}`
    );
  }

  if (obj.vintage !== null && (!Number.isInteger(obj.vintage) || obj.vintage < 1800 || obj.vintage > new Date().getFullYear())) {
    throw new Error(`Invalid vintage year: ${obj.vintage}`);
  }

  if (typeof obj.estimated_price !== "number" || obj.estimated_price < 0) {
    throw new Error("estimated_price must be a non-negative number.");
  }

  if (
    typeof obj.rating_out_of_100 !== "number" ||
    obj.rating_out_of_100 < 50 ||
    obj.rating_out_of_100 > 100
  ) {
    throw new Error("rating_out_of_100 must be a number between 50 and 100.");
  }

  if (typeof obj.drink_now !== "boolean") {
    throw new Error("drink_now must be a boolean.");
  }
}

module.exports = { analyzeWineImage };
