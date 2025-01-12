require("dotenv").config();
import { createClient } from "@supabase/supabase-js";

// Create and export Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_KEY ?? ""
);

export default supabase;
