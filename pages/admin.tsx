// pages/admin.tsx
import { FormEvent, useState } from "react";
import Layout from "../components/Layout";
import type { GetServerSideProps } from "next";
import jwt from "jsonwebtoken";

export default function Admin() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Filosofia");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [publishedAt, setPublishedAt] = useState(""); // yyyy-MM-dd
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const res = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        category,
        summary,
        content,
        publishedAt,
      }),
    });

    setLoading(false);

    if (res.ok) {
      setMessage("Artigo publicado com sucesso!");
      setTitle("");
      setSummary("");
      setContent("");
      setPublishedAt("");
    } else {
      const data = await res.json();
      setMessage(data.error || "Erro ao publicar artigo.");
    }
  }

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <Layout>
      <h2 className="page-title">Painel de Administração</h2>
      <p className="page-subtitle">
        Preencha os campos abaixo para criar um novo artigo. Esta página é
        restrita ao administrador.
      </p>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div>
          <label>Título</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Categoria</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Ex.: Filosofia, Educação, Sociedade..."
            required
          />
        </div>

        <div>
          <label>Data de publicação</label>
          <input
            type="date"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Resumo (3 linhas iniciais)</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            maxLength={500}
            required
          />
        </div>

        <div>
          <label>Conteúdo do artigo</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Publicando..." : "Publicar artigo"}
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>

        {message && <p className="admin-message">{message}</p>}
      </form>
    </Layout>
  );
}

// Proteção do /admin
export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookieHeader = context.req.headers.cookie ?? "";
  const token = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("admin_token="))
    ?.split("=")[1];

  if (!token || !process.env.JWT_SECRET) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return { props: {} };
  } catch {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};
