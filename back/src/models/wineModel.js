const { supabase } = require("../config/database");
const TABLE = "wines";

async function insertWine(wineData, status = "cellar") {
  const record = {
    wine_name:            wineData.wine_name.trim(),
    winery:               wineData.winery.trim(),
    vintage:              wineData.vintage ?? null,
    type:                 wineData.type,
    characteristics:      wineData.characteristics.trim(),
    estimated_price:      wineData.estimated_price,
    rating_out_of_100:    wineData.rating_out_of_100,
    aging_potential:      wineData.aging_potential.trim(),
    ideal_drinking_years: wineData.ideal_drinking_years?.trim() ?? null,
    drink_now:            wineData.drink_now,
    status,               // 'cellar' or 'wishlist'
  };

  const { data, error } = await supabase.from(TABLE).insert(record).select().single();
  if (error) {
    const e = new Error(`Database insert failed: ${error.message}`);
    e.code = "DB_INSERT_ERROR";
    throw e;
  }
  return data;
}

async function updateWineStatus(id, status) {
  if (!["cellar", "wishlist", "deleted"].includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }
  const { data, error } = await supabase
    .from(TABLE)
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update wine status: ${error.message}`);
  return data;
}

async function deleteWine(id) {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(`Failed to delete wine: ${error.message}`);
}

async function getAllWines() {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("scanned_at", { ascending: false });
  if (error) throw new Error(`Database query failed: ${error.message}`);
  return data;
}

async function getWineById(id) {
  const { data, error } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`Database query failed: ${error.message}`);
  return data;
}

module.exports = { insertWine, updateWineStatus, deleteWine, getAllWines, getWineById };