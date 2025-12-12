// pages/index.tsx
import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import { prisma } from "../lib/prisma";
import type { Article } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  latestArticles: Article[];
};

type Slide = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  href: string;
};

const slides: Slide[] = [
  {
    id: 1,
    title: "Curso on-line · Platão e o Platonismo",
    subtitle:
      "Leituras guiadas dos diálogos platônicos, com foco em metafísica, ética e política.",
    image: "/banner-platao.jpg",
    href: "https://escola.valderi.com.br/cursos/filosofia/platao-e-o-platonismo.html",
  },
  {
    id: 2,
    title: "Escola Immortalis · Formação Humanista",
    subtitle:
      "Percursos formativos em filosofia, espiritualidade e vida intelectual, para alunos e educadores.",
    image: "/banner-immortalis.jpg",
    href: "https://escola.valderi.com.br/index.html",
  },
  {
    id: 3,
    title: "Assessoria Acadêmica & Científica",
    subtitle:
      "Acompanhamento personalizado em projetos, TCC, dissertações e teses – da ideia à defesa.",
    image: "/banner-assessoria2.jpg",
    href: "https://assessoria.valderi.com.br/",
  },
    {
    id: 3,
    title: "Programas Valderi no canal ValmiTV",
    subtitle:
      "Programas do professor Valderi disponíveis na internet.",
    image: "/banner-valmitv2.jpg",
    href: "https://www.valmitv.com/programas-valderi.html",
  },
];

function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  // troca automática a cada 7 segundos
  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  function openSlide(href: string) {
    if (typeof window !== "undefined") {
      window.open(href, "_blank");
    }
  }

  return (
    <div className="hero-carousel">
      {slides.map((slide, index) => (
        <button
          key={slide.id}
          type="button"
          className={`hero-slide ${index === current ? "is-active" : ""}`}
          onClick={() => openSlide(slide.href)}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            sizes="(max-width: 1024px) 100vw, 640px"
            style={{ objectFit: "cover" }}
            priority={index === 0}
          />
          <div className="hero-slide-overlay">
            <h3>{slide.title}</h3>
            <p>{slide.subtitle}</p>
            <span className="hero-slide-cta">Saiba mais →</span>
          </div>
        </button>
      ))}

      <div className="hero-dots">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            className={`hero-dot ${index === current ? "is-active" : ""}`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  );
}

function Home({ latestArticles }: Props) {
  return (
    <Layout>
      {/* HERO */}
      <section className="hero">
        <div className="hero-text">
          <h1 className="hero-title">Domine, ut videam, ut sit.</h1>
          <p className="hero-subtitle">
            Este espaço reúne minha trajetória nas ciências humanas, reflexões
            filosóficas e artigos que dialogam com educação, sociedade e
            espiritualidade.
          </p>
          <p className="hero-subtitle">
            Aqui você encontrará textos, projetos e materiais pensados para
            alunos, pesquisadores e interessados em humanidades.
          </p>

          <div className="hero-buttons">
            <Link href="/artigos" className="btn-primary">
              Ler artigos
            </Link>
            <a
              href="http://lattes.cnpq.br/2221465230465176"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Ver currículo Lattes
            </a>
          </div>
        </div>

        {/* Carrossel de banners no lugar da foto */}
        <HeroCarousel />
      </section>

      {/* ÚLTIMOS ARTIGOS */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Últimos artigos</h2>
          <Link href="/artigos" className="section-link">
            Ver todos os artigos →
          </Link>
        </div>

        <div className="articles-list">
          {latestArticles.length === 0 && (
            <p>Ainda não há artigos publicados.</p>
          )}

          {latestArticles.map((article) => (
            <article key={article.id} className="article-card">
              <div className="article-meta">
                <span>
                  {new Date(article.publishedAt).toLocaleDateString("pt-BR")}
                </span>
                {" · "}
                <span>{article.category}</span>
              </div>
              <h3 className="article-title">{article.title}</h3>
              <p className="article-summary">{article.summary}</p>
              <Link href={`/artigos/${article.slug}`}>
                Ler artigo completo →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}

export default Home;

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const latestArticles = await prisma.article.findMany({
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return {
    props: {
      latestArticles: JSON.parse(JSON.stringify(latestArticles)),
    },
  };
};
