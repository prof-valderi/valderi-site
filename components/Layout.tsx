// components/Layout.tsx
import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const navItems = [
  { href: "/", label: "Início" },
  { href: "/curriculo", label: "Currículo Lattes" },
  { href: "/filosofia", label: "Filosofia & Objetivo" },
  { href: "/artigos", label: "Artigos" },
  { href: "/admin", label: "Admin" },
];

export default function Layout({ children }: Props) {
  return (
    <div className="main-wrapper">
      <header className="site-header">
        <div className="main-container site-header-inner">
          <div className="logo-area">
            <Image
              src="/brasao.png"
              alt="Brasão pessoal"
              width={52}
              height={52}
              className="logo-mark"
              priority
            />
            <div>
              <div className="logo-text-main">Prof. Valderi da Silva</div>
              <div className="logo-text-sub">
                Humanidades · Filosofia · Pesquisa
              </div>
            </div>
          </div>

          <nav className="site-nav">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <div className="main-container">{children}</div>
      </main>

      <footer className="site-footer">
        © {new Date().getFullYear()} Prof. Valderi da Silva
      </footer>
    </div>
  );
}
