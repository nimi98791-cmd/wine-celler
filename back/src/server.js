require("dotenv").config();

const app = require("./app");
const { verifyConnection } = require("./config/database");

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    // Fail fast: verify DB connection before accepting traffic
    await verifyConnection();

    app.listen(PORT, () => {
      console.log(`🍷 Wine Cellar API running on http://localhost:${PORT}`);
      console.log(`   POST /api/wines/scan  — scan a bottle`);
      console.log(`   GET  /api/wines       — list your cellar`);
      console.log(`   GET  /api/wines/:id   — bottle details`);
    });
  } catch (err) {
    console.error("❌ Server failed to start:", err.message);
    process.exit(1);
  }
}

start();
