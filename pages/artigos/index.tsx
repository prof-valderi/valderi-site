// pages/artigos/index.tsx
import { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
import { prisma } from "../../lib/prisma";
import { Article } from "@prisma/client";
import Link from "next/link";

type ArticlesByYear = {
  year: number;
  articles: Article[];
};

type Props = {
  articlesByYear: ArticlesByYear[];
  query: string;
  category: string;
};

function Artigos({ articlesByYear, query, category }: Props) {
  return (
    <Layout>
      <h2 className="page-title">Artigos</h2>
      <p className="page-subtitle">
        Busque por título, categoria ou palavra-chave, ou navegue pelo arquivo
        organizado por ano de publicação.
      </p>

      {/* FORMULÁRIO DE BUSCA */}
      <form
        method="GET"
        style={{
          marginBottom: "2rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          name="q"
          placeholder="Buscar por palavra, título ou resumo..."
          defaultValue={query}
          style={{
            padding: "0.6rem 0.8rem",
            borderRadius: "0.6rem",
            border: "1px solid rgba(148,163,184,0.7)",
            background: "#020617",
            color: "#f9fafb",
            minWidth: "260px",
            flex: "1",
          }}
        />

        <input
          type="text"
          name="categoria"
          placeholder="Categoria (opcional)"
          defaultValue={category}
          style={{
            padding: "0.6rem 0.8rem",
            borderRadius: "0.6rem",
            border: "1px solid rgba(148,163,184,0.7)",
            background: "#020617",
            color: "#f9fafb",
            minWidth: "180px",
          }}
        />

        <button type="submit" className="btn-secondary">
          Buscar
        </button>
      </form>

      {/* LISTA AGRUPADA POR ANO */}
      <div className="articles-list">
        {articlesByYear.length === 0 && <p>Nenhum artigo encontrado.</p>}

        {articlesByYear.map((group) => (
          <div key={group.year} style={{ marginBottom: "2rem" }}>
            <h3 style={{ marginBottom: "0.8rem" }}>{group.year}</h3>

            {group.articles.map((article) => (
              <article key={article.id} className="article-card">
                <div className="article-meta">
                  <span>
                    {new Date(article.publishedAt).toLocaleDateString("pt-BR")}
                  </span>
                  {" · "}
                  <Link
                    href={`/artigos?categoria=${encodeURIComponent(
                      article.category
                    )}`}
                    className="article-category-link"
                  >
                    {article.category}
                  </Link>
                </div>
                <h3 className="article-title">{article.title}</h3>
                <p className="article-summary">{article.summary}</p>
                <Link href={`/artigos/${article.slug}`}>
                  Ler artigo completo →
                </Link>
              </article>
            ))}
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default Artigos;

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const q = (context.query.q as string) || "";
  const categoria = (context.query.categoria as string) || "";

  const where: any = {};

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { summary: { contains: q } },
      { content: { contains: q } },
      { category: { contains: q } },
    ];
  }

  if (categoria) {
    where.category = { contains: categoria };
  }

  const articles = await prisma.article.findMany({
    where,
    orderBy: { publishedAt: "desc" },
  });

  // Agrupa por ano de publicação
  const byYearMap: Record<number, Article[]> = {};

  for (const article of articles) {
    const year = new Date(article.publishedAt).getFullYear();
    if (!byYearMap[year]) byYearMap[year] = [];
    byYearMap[year].push(article);
  }

  const articlesByYear: ArticlesByYear[] = Object.keys(byYearMap)
    .map((yearStr) => ({
      year: Number(yearStr),
      articles: byYearMap[Number(yearStr)],
    }))
    .sort((a, b) => b.year - a.year);

  return {
    props: {
      articlesByYear: JSON.parse(JSON.stringify(articlesByYear)),
      query: q,
      category: categoria,
    },
  };
};
