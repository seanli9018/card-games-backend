const supabase = require("../../lib/supabaseClient");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2"); // Ensure storing hashed passwords in the database.
const { emailValidator, passwordValidator } = require("../../util/validators");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, password } = req.body;

  const isValidEmail = emailValidator(email);
  const isValidPassword = passwordValidator(password);

  // Validate the input
  if (!isValidEmail || !isValidPassword) {
    return res
      .status(400)
      .json({ error: "Valid email and password are required" });
  }

  try {
    // Fetch the user by email
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (error || !user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare provided password with the hashed password in the database
    const hashedPassword = await argon2.hash(password);
    const isMatch = await argon2.verify(hashedPassword, user[0].password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate a JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET, // Store JWT_SECRET in .env file
      { expiresIn: "24h" } // valid for 24 hrs.
    );

    // set token to client side cookie.
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use `secure: true` in production for HTTPS only
      sameSite: "Strict", // Prevents CSRF
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    });

    // response success message.
    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
