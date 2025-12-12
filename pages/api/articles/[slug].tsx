// pages/artigos/[slug].tsx
import { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
import { prisma } from "../../lib/prisma";
import { Article } from "@prisma/client";

type Props = {
  article: Article | null;
};

export default function ArtigoPage({ article }: Props) {
  if (!article) {
    return (
      <Layout>
        <p>Artigo não encontrado.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ maxWidth: "56rem" }}>
        <div className="article-meta">
          <span>{new Date(article.publishedAt).toLocaleDateString("pt-BR")}</span>
          {" · "}
          <span>{article.category}</span>
        </div>
        <h1 className="page-title" style={{ marginTop: "0.3rem" }}>
          {article.title}
        </h1>

        <div
          style={{ marginTop: "1.5rem", lineHeight: 1.7, fontSize: "0.98rem" }}
        >
          {article.content.split("\n").map((p, idx) => (
            <p key={idx} style={{ marginBottom: "1rem" }}>
              {p}
            </p>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const slug = context.params?.slug as string;

  const article = await prisma.article.findUnique({
    where: { slug },
  });

  return {
    props: {
      article: article ? JSON.parse(JSON.stringify(article)) : null,
    },
  };
};
