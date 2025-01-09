require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

// Create and export Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = supabase;
