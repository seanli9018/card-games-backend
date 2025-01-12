import type { Request, Response } from "express";
// import { from } from "../../lib/supabaseClient";

export default async (req: Request, res: Response) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Missing required user ID" });
  }

  // Delete user from Supabase
  // const { data, error } = await from("user").delete().eq("id", id);

  // if (error) {
  //   return res.status(500).json({ error: error.message });
  // }

  // res.status(200).json({ message: "User deleted successfully", user: data });
};
