// pages/api/articles/[slug].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;

  if (req.method === "GET") {
    const article = await prisma.article.findUnique({
      where: { slug: slug as string },
    });

    if (!article) return res.status(404).json({ error: "Artigo não encontrado" });

    return res.status(200).json(article);
  }

  res.setHeader("Allow", ["GET"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
