const supabase = require("../../lib/supabaseClient");

module.exports = async (req, res) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Missing required user ID" });
  }

  // Delete user from Supabase
  const { data, error } = await supabase.from("user").delete().eq("id", id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: "User deleted successfully", user: data });
};
