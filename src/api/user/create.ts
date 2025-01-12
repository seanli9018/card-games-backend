// import { from } from "../../lib/supabaseClient";
import type { Response, Request } from "express";

// create user
export default async (req: Request, res: Response) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, username, password } = req.body;

  // Validate input
  if (!email || !username || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Insert into Supabase
  // const { data, error } = await from("user").insert([
  //   { email, username, password },
  // ]);

  // if (error) {
  //   return res.status(500).json({ error: error.message });
  // }

  // res.status(201).json({ message: "User created successfully", user: data });
};
