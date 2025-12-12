// pages/api/articles/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import slugify from "slugify";
import jwt from "jsonwebtoken";

function isAdminAuthenticated(req: NextApiRequest): boolean {
  const cookieHeader = req.headers.cookie ?? "";
  const token = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("admin_token="))
    ?.split("=")[1];

  if (!token || !process.env.JWT_SECRET) return false;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET) as {
      role?: string;
    };
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const articles = await prisma.article.findMany({
      orderBy: { publishedAt: "desc" },
    });
    return res.status(200).json(articles);
  }

  if (req.method === "POST") {
    if (!isAdminAuthenticated(req)) {
      return res.status(401).json({ error: "Não autorizado." });
    }

    const { title, category, summary, content, publishedAt } = req.body;

    if (!title || !category || !summary || !content || !publishedAt) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes." });
    }

    const slug = slugify(title, { lower: true, strict: true });

    const article = await prisma.article.create({
      data: {
        title,
        category,
        summary,
        content,
        slug,
        publishedAt: new Date(publishedAt),
      },
    });

    return res.status(201).json(article);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
