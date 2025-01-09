const supabase = require("../../lib/supabaseClient");

module.exports = async (req, res) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { id, username, email } = req.body;

  if (!id || (!username && !email)) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Update user in Supabase
  const { data, error } = await supabase
    .from("user")
    .update({ username, email })
    .eq("id", id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: "User updated successfully", user: data });
};
