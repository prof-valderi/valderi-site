// pages/login.tsx
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

export default function Login() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json();
      setMessage(data.error || "Falha ao realizar login.");
    }
  }

  return (
    <Layout>
      <h2 className="page-title">Login do administrador</h2>
      <p className="page-subtitle">
        Insira a senha de administrador para acessar o painel de publicação de artigos.
      </p>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div>
          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          style={{ marginTop: "0.5rem" }}
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {message && <p className="admin-message">{message}</p>}
      </form>
    </Layout>
  );
}
