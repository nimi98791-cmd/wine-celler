const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase credentials. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file."
  );
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Verifies the database connection by running a lightweight query.
 * Called on server startup to fail fast if credentials are wrong.
 */
async function verifyConnection() {
  const { error } = await supabase.from("wines").select("id").limit(1);
  if (error && error.code !== "PGRST116") {
    // PGRST116 = table empty, which is fine
    throw new Error(`Supabase connection failed: ${error.message}`);
  }
  console.log("✅ Supabase connection verified.");
}

module.exports = { supabase, verifyConnection };
