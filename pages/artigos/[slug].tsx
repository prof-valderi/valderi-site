// pages/artigos/[slug].tsx
import { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
import { prisma } from "../../lib/prisma";
import { Article } from "@prisma/client";
import Link from "next/link";

type NavArticle = {
  slug: string;
  title: string;
} | null;

type Props = {
  article: Article | null;
  prevArticle: NavArticle;
  nextArticle: NavArticle;
};

export default function ArtigoPage({ article, prevArticle, nextArticle }: Props) {
  if (!article) {
    return (
      <Layout>
        <div className="article-container">
          <h2 className="page-title">Artigo não encontrado</h2>
          <p className="page-subtitle">
            O texto solicitado não existe ou foi removido.
          </p>

          <Link href="/artigos" className="btn-secondary">
            ← Voltar para artigos
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="article-container">
        <div className="article-meta">
          <span>{new Date(article.publishedAt).toLocaleDateString("pt-BR")}</span>
            {" · "}
            <Link
                href={`/artigos?categoria=${encodeURIComponent(article.category)}`}
                className="article-category-link"
            >
                {article.category}
            </Link>
        </div>

        <h1 className="page-title article-title-main">{article.title}</h1>

        <div className="article-body">
          {article.content.split("\n").map((p, index) => {
            const trimmed = p.trim();
            if (!trimmed) return null;
            return <p key={index}>{trimmed}</p>;
          })}
        </div>

        <div className="article-nav">
          <Link href="/artigos" className="article-back-link">
            ← Voltar para artigos
          </Link>

          <div className="article-nav-links">
            {prevArticle && (
              <Link
                href={`/artigos/${prevArticle.slug}`}
                className="article-nav-link"
              >
                ← Anterior: {prevArticle.title}
              </Link>
            )}
            {nextArticle && (
              <Link
                href={`/artigos/${nextArticle.slug}`}
                className="article-nav-link"
              >
                Próximo: {nextArticle.title} →
              </Link>
            )}
          </div>
        </div>
      </article>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const slug = context.params?.slug as string;

  const article = await prisma.article.findUnique({
    where: { slug },
  });

  if (!article) {
    return {
      props: {
        article: null,
        prevArticle: null,
        nextArticle: null,
      },
    };
  }

  // artigo anterior (publicado antes)
  const prev = await prisma.article.findFirst({
    where: {
      publishedAt: {
        lt: article.publishedAt,
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    select: {
      slug: true,
      title: true,
    },
  });

  // próximo artigo (publicado depois)
  const next = await prisma.article.findFirst({
    where: {
      publishedAt: {
        gt: article.publishedAt,
      },
    },
    orderBy: {
      publishedAt: "asc",
    },
    select: {
      slug: true,
      title: true,
    },
  });

  return {
    props: {
      article: JSON.parse(JSON.stringify(article)),
      prevArticle: prev ? JSON.parse(JSON.stringify(prev)) : null,
      nextArticle: next ? JSON.parse(JSON.stringify(next)) : null,
    },
  };
};
