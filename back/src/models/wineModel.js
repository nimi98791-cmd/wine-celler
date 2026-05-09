const { supabase } = require("../config/database");

const TABLE = "wines";

/**
 * Inserts a validated wine record into Supabase.
 *
 * The `wines` table schema (run this SQL in Supabase SQL editor):
 *
 *   create table wines (
 *     id                uuid primary key default gen_random_uuid(),
 *     wine_name         text        not null,
 *     winery            text        not null,
 *     vintage           smallint,
 *     type              text        not null,
 *     characteristics   text        not null,
 *     estimated_price   numeric(10,2),
 *     rating_out_of_100 smallint,
 *     aging_potential   text,
 *     drink_now         boolean     not null default false,
 *     scanned_at        timestamptz not null default now()
 *   );
 *
 * @param {object} wineData  Validated wine object from visionService.
 * @returns {Promise<object>}  The inserted row including generated id.
 */
async function insertWine(wineData) {
  const record = {
    wine_name:         wineData.wine_name.trim(),
    winery:            wineData.winery.trim(),
    vintage:           wineData.vintage ?? null,
    type:              wineData.type,
    characteristics:   wineData.characteristics.trim(),
    estimated_price:   wineData.estimated_price,
    rating_out_of_100: wineData.rating_out_of_100,
    aging_potential:   wineData.aging_potential.trim(),
    drink_now:         wineData.drink_now,
  };

  const { data, error } = await supabase
    .from(TABLE)
    .insert(record)
    .select()
    .single();

  if (error) {
    const dbErr = new Error(`Database insert failed: ${error.message}`);
    dbErr.code = "DB_INSERT_ERROR";
    dbErr.detail = error.details ?? null;
    throw dbErr;
  }

  return data;
}

/**
 * Fetches all wines, newest first.
 * @returns {Promise<object[]>}
 */
async function getAllWines() {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("scanned_at", { ascending: false });

  if (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }

  return data;
}

/**
 * Fetches a single wine by ID.
 * @param {string} id  UUID
 * @returns {Promise<object|null>}
 */
async function getWineById(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }

  return data; // null if not found
}

module.exports = { insertWine, getAllWines, getWineById };
