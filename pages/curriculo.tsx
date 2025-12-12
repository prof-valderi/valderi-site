// pages/curriculo.tsx
import Layout from "../components/Layout";

const LATTES_URL = "http://lattes.cnpq.br/2221465230465176";

export default function CurriculoLattes() {
  return (
    <Layout>
      <section className="lattes-section">
        <h1 className="page-title">Currículo Lattes</h1>

        <p className="page-subtitle">
          Abaixo está incorporado o currículo disponível na plataforma Lattes
          (CNPq). Nele constam minha formação, atuação acadêmica, produção
          bibliográfica e experiência em pesquisa e docência.
        </p>

        <div className="lattes-grid">
          <div className="lattes-card">
            <h2>Áreas de atuação</h2>
            <p>
              Meu percurso transita principalmente pelas áreas de{" "}
              <strong>Filosofia</strong>, <strong>Educação</strong> e{" "}
              <strong>Humanidades</strong>, com especial interesse em:
            </p>

            <ul>
              <li>Filosofia antiga e medieval;</li>
              <li>Antropologia filosófica e sentido da vida intelectual;</li>
              <li>Ética, educação e espiritualidade;</li>
              <li>Pesquisa acadêmica e formação de pesquisadores.</li>
            </ul>

            <p>
              Para detalhes atualizados sobre publicações, orientações e
              projetos em andamento, acesse diretamente o currículo na base
              oficial do CNPq.
            </p>

            <div className="lattes-buttons">
              <a
                href={LATTES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Abrir currículo no Lattes
              </a>
              <a
                href={LATTES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Ver página completa
              </a>
            </div>
          </div>

          <div className="lattes-iframe-wrapper">
            <div className="lattes-iframe-header">
              <span>Visualização rápida do currículo</span>
            </div>
            <iframe
              src={LATTES_URL}
              title="Currículo Lattes de Prof. Valderi da Silva"
              className="lattes-iframe"
            />
            <p className="lattes-iframe-note">
              Caso a visualização esteja lenta ou indisponível, utilize o botão{" "}
              <strong>“Abrir currículo no Lattes”</strong> para acessar
              diretamente a página oficial.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
