import type { Response } from "express";
import { SignJWT, jwtVerify } from "jose";
import { TOKEN_AGE } from "./constants";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function signToken(payload: any) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(JWT_SECRET);

  return token;
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload;
  } catch (error) {
    return null;
  }
}

export async function setTokenToCookie(res: Response, token: string) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use `secure: true` in production for HTTPS only
    sameSite: "strict", // Prevents CSRF
    maxAge: TOKEN_AGE, // 1 day expiration
  });
}
