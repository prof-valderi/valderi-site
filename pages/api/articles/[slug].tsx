// pages/artigos/[slug].tsx
import { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
import { prisma } from "../../lib/prisma";
import type { Article } from "@prisma/client";
import Link from "next/link";

type Props = {
  article: Article;
  previousArticle: Article | null;
  nextArticle: Article | null;
};

export default function ArtigoPage({
  article,
  previousArticle,
  nextArticle,
}: Props) {
  const dataPublicacao = new Date(article.publishedAt).toLocaleDateString(
    "pt-BR"
  );

  return (
    <Layout>
      <div className="article-container">
        <Link href="/artigos" className="article-back-link">
          ← Voltar para artigos
        </Link>

        <p className="article-meta" style={{ marginTop: "0.5rem" }}>
          {dataPublicacao} · {article.category}
        </p>

        <h1 className="page-title article-title-main">{article.title}</h1>

        <div className="article-body article-content">
          {article.content.split("\n\n").map((paragrafo, index) => (
            <p key={index}>{paragrafo}</p>
          ))}
        </div>

        <div className="article-nav">
          <div className="article-nav-links">
            {previousArticle && (
              <Link
                href={`/artigos/${previousArticle.slug}`}
                className="article-nav-link"
              >
                ← Artigo anterior: {previousArticle.title}
              </Link>
            )}

            {nextArticle && (
              <Link
                href={`/artigos/${nextArticle.slug}`}
                className="article-nav-link"
              >
                Próximo artigo: {nextArticle.title} →
              </Link>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const slug = context.params?.slug as string;

  const article = await prisma.article.findUnique({
    where: { slug },
  });

  if (!article) {
    return {
      notFound: true,
    };
  }

  const previousArticle = await prisma.article.findFirst({
    where: {
      publishedAt: {
        lt: article.publishedAt,
      },
    },
    orderBy: { publishedAt: "desc" },
  });

  const nextArticle = await prisma.article.findFirst({
    where: {
      publishedAt: {
        gt: article.publishedAt,
      },
    },
    orderBy: { publishedAt: "asc" },
  });

  return {
    props: {
      article: JSON.parse(JSON.stringify(article)),
      previousArticle: previousArticle
        ? JSON.parse(JSON.stringify(previousArticle))
        : null,
      nextArticle: nextArticle ? JSON.parse(JSON.stringify(nextArticle)) : null,
    },
  };
};
