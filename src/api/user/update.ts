import type { Request, Response } from "express";
// import { from } from "../../lib/supabaseClient";

export default async (req: Request, res: Response) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { id, username, email } = req.body;

  if (!id || (!username && !email)) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Update user in Supabase
  // const { data, error } = await from("user")
  //   .update({ username, email })
  //   .eq("id", id);

  // if (error) {
  //   return res.status(500).json({ error: error.message });
  // }

  // res.status(200).json({ message: "User updated successfully", user: data });
};
