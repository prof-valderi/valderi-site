// pages/index.tsx
import Layout from "../components/Layout";
import Link from "next/link";

export default function Home() {
  return (
    <Layout>
      <section className="hero">
        <div className="hero-text">
          <h2>Domine, ut videam, ut sit.</h2>
          <p>
            Este espaço reúne minha trajetória nas ciências humanas, reflexões filosóficas
            e artigos que dialogam com educação, sociedade e espiritualidade.
          </p>
          <p>
            Aqui você encontrará textos, projetos e materiais pensados para alunos,
            pesquisadores e interessados em humanidades.
          </p>

          <div className="hero-buttons">
            <Link href="/artigos" className="btn-primary">
              Ler artigos
            </Link>
            <Link href="/curriculo" className="btn-secondary">
              Ver currículo Lattes
            </Link>
          </div>
        </div>

        <div className="hero-photo">
          <img src="/perfil.png" alt="Prof. Valderi da Silva" />
        </div>
      </section>
    </Layout>
  );
}
