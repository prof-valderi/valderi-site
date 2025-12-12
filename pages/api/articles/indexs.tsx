// pages/artigos/index.tsx
import { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
import { prisma } from "../../lib/prisma";
import Link from "next/link";
import { Article } from "@prisma/client";

type Props = {
  articles: Article[];
};

export default function Artigos({ articles }: Props) {
  return (
    <Layout>
      <h2 className="page-title">Artigos</h2>
      <p className="page-subtitle">
        Textos organizados por temas nas áreas de filosofia, educação e humanidades.
      </p>

      <div className="articles-list">
        {articles.length === 0 && <p>Ainda não há artigos publicados.</p>}

        {articles.map((article) => (
          <article key={article.id} className="article-card">
            <div className="article-meta">
              <span>{new Date(article.publishedAt).toLocaleDateString("pt-BR")}</span>
              {" · "}
              <span>{article.category}</span>
            </div>
            <h3 className="article-title">{article.title}</h3>
            <p className="article-summary">{article.summary}</p>
            <Link href={`/artigos/${article.slug}`}>Ler artigo completo →</Link>
          </article>
        ))}
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const articles = await prisma.article.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)),
    },
  };
};
