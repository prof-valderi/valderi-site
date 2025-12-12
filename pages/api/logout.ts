// pages/api/logout.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Zera o cookie
  res.setHeader(
    "Set-Cookie",
    "admin_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax;"
  );

  return res.status(200).json({ ok: true });
}
