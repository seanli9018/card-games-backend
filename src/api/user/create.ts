import type { Response, Request, NextFunction } from "express";
import supabase from "../../lib/supabaseClient";
import argon2 from "argon2"; // Ensure storing hashed passwords in the database.
import { signToken, setTokenToCookie } from "../../lib/auth";
import {
  emailValidator,
  usernameValidator,
  passwordValidator,
} from "../../util/validators";

// create user
const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { email, username, password } = req.body;

  const isValidEmail = emailValidator(email);
  const isValidUsername = usernameValidator(username);
  const isValidPassword = passwordValidator(password);

  // Validate input
  if (!isValidEmail || !isValidUsername || !isValidPassword) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  // Step 1: check if the email already exists
  const { data: existingUser, error: findError } = await supabase
    .from("users")
    .select("id") // Only select necessary columns for performance optimization.
    .eq("email", email)
    .single(); // .single() ensures we expect only one row or none.

  if (findError && findError.code !== "PGRST116") {
    // If the error is not "Row not found", throw it
    throw findError;
  }

  // Step 2: if email exists, handle it with returning 409 conflict status code.
  if (existingUser) {
    res.status(409).json({
      message: "Email already exists!",
      user: null,
    });
    return;
  }

  // Step 3: Insert/create a new user
  try {
    const hashedPassword = await argon2.hash(password);
    const { data: newUser, error } = await supabase
      .from("users")
      .insert([{ email, username, password: hashedPassword }])
      .select("*");

    if (error || !newUser) {
      res.status(500).json({ error: error.message });
      return;
    }

    // Generate a JWT
    const token = await signToken({
      id: newUser[0].id,
      email: newUser[0].email,
    });

    // set token to client side cookie.
    setTokenToCookie(res, token);

    res.status(201).json({
      message: "User created successfully",
      user: {
        username: newUser[0].username,
        email: newUser[0].email,
        role: newUser[0].role,
        profile_picture: newUser[0].profile_picture,
      },
    });
  } catch (err) {
    next(err);
  }
};

export default create;
