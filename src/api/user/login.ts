import type { Request, Response, NextFunction, Application } from "express";
import supabase from "../../lib/supabaseClient";
import argon2 from "argon2"; // Ensure storing hashed passwords in the database.
import { signToken } from "../../lib/auth";
import { emailValidator, passwordValidator } from "../../util/validators";

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { email, password } = req.body;

  const isValidEmail = emailValidator(email);
  const isValidPassword = passwordValidator(password);

  // Validate the input
  if (!isValidEmail || !isValidPassword) {
    res.status(400).json({ error: "Valid email and password are required" });
    return;
  }

  try {
    // Fetch the user by email
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (error || !user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Compare provided password with the hashed password in the database.
    const hashedPassword = await argon2.hash(password);
    const isMatch = await argon2.verify(hashedPassword, user[0].password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Inactive or unverified user handling.
    if (!user[0].is_active || !user[0].is_verified) {
      res.status(403).json({
        error:
          "User is inactive or unverified. Please verify your account or contact support.",
      });
      return;
    }

    // Generate a JWT
    const token = await signToken({ id: user[0].id, email: user[0].email });

    // set token to client side cookie.
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use `secure: true` in production for HTTPS only
      sameSite: "strict", // Prevents CSRF
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    });

    // response success message.
    res.status(200).json({
      message: "Login successful",
      user: {
        username: user[0].username,
        email: user[0].email,
        role: user[0].role,
        profile_picture: user[0].profile_picture,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export default login;
