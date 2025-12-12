// pages/filosofia.tsx
import Layout from "../components/Layout";

export default function Filosofia() {
  return (
    <Layout>
      <h2 className="page-title">Filosofia e objetivo deste site</h2>
      <p className="page-subtitle">
        Um espaço de reflexão, formação e diálogo nas humanidades.
      </p>

      <div style={{ maxWidth: "56rem", lineHeight: 1.7, fontSize: "0.98rem" }}>
        <p style={{ marginBottom: "1rem" }}>
          Este site nasce do desejo de reunir, em um só lugar, minha experiência acadêmica,
          minha atuação docente e minhas inquietações filosóficas. Ele é um laboratório
          vivo, em que ideias são amadurecidas em textos, aulas, cursos e projetos.
        </p>
        <p style={{ marginBottom: "1rem" }}>
          A inspiração do lema <strong>&quot;Domine, ut videam, ut sit&quot;</strong> aponta
          para uma busca: ver o real com mais profundidade para que a vida, em todas as suas
          dimensões, possa florescer. Humanidades, aqui, não são apenas um campo
          de estudo, mas um modo de habitar o mundo.
        </p>
        <p>
          Meu objetivo é oferecer materiais que ajudem estudantes, professores e
          interessados em filosofia, teologia, educação e cultura a pensar com rigor,
          mas também com sensibilidade, a complexidade do nosso tempo.
        </p>
      </div>
    </Layout>
  );
}
