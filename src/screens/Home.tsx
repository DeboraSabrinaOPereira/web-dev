"use client";

import { useMemo, useState } from "react";
import {
  FaCreditCard,
  FaDownload,
  FaLock,
  FaTruck,
} from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import { useNavigation } from "../contexts/NavigationContext";
import { useStore } from "../contexts/StoreContext";
import type { ProductType } from "../types";

type FormatFilter = "todos" | ProductType;

export default function Home({ search }: { search: string }) {
  const { products } = useStore();
  const { navigate } = useNavigation();
  const [format, setFormat] = useState<FormatFilter>("todos");
  const [category, setCategory] = useState("todas");
  const [tag, setTag] = useState("todas");

  const activeProducts = products.filter((product) => product.status === "ativo");
  const categories = useMemo(
    () => [...new Set(activeProducts.map((product) => product.category))].sort(),
    [activeProducts],
  );
  const tags = useMemo(
    () => [...new Set(activeProducts.flatMap((product) => product.tags))].sort(),
    [activeProducts],
  );

  const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
  const visible = activeProducts.filter((product) => {
    if (format !== "todos" && product.type !== format) return false;
    if (category !== "todas" && product.category !== category) return false;
    if (tag !== "todas" && !product.tags.includes(tag)) return false;
    if (!normalizedSearch) return true;
    return [
      product.title,
      product.author,
      product.category,
      product.tags.join(" "),
    ]
      .join(" ")
      .toLocaleLowerCase("pt-BR")
      .includes(normalizedSearch);
  });

  function showCatalog() {
    navigate("/");
    window.setTimeout(
      () => document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" }),
      40,
    );
  }

  return (
    <main>
      <section className="hero-section">
        <div className="hero-row shell">
          <div className="hero-content">
            <span className="eyebrow">Editora COMPIA</span>
            <h1>Conhecimento em Inteligência Artificial ao seu alcance</h1>
            <p>
              Livros físicos, e-books e kits para estudantes e profissionais de
              tecnologia, com compra simples e entrega para todo o Brasil.
            </p>
            <button type="button" className="btn hero-cta" onClick={showCatalog}>
              Ver catálogo
            </button>
          </div>
          <div className="books-showcase" aria-label="Seleção de livros COMPIA">
            <div className="book-row">
              <img src="/images/book-2.png" alt="" />
              <img src="/images/book-5.png" alt="" />
              <img src="/images/book-7.png" alt="" />
            </div>
            <img className="book-stand" src="/images/stand.png" alt="" />
          </div>
        </div>
      </section>

      <section className="benefits shell" aria-label="Recursos da loja">
        <article>
          <FaTruck aria-hidden="true" />
          <div>
            <h2>Múltiplas entregas</h2>
            <p>Correios, transportadora ou retirada local</p>
          </div>
        </article>
        <article>
          <FaLock aria-hidden="true" />
          <div>
            <h2>Compra segura</h2>
            <p>Fluxo de pagamento demonstrativo</p>
          </div>
        </article>
        <article>
          <FaCreditCard aria-hidden="true" />
          <div>
            <h2>Cartão e PIX</h2>
            <p>Principais bandeiras e QR Code</p>
          </div>
        </article>
        <article>
          <FaDownload aria-hidden="true" />
          <div>
            <h2>E-books imediatos</h2>
            <p>Download na área do cliente</p>
          </div>
        </article>
      </section>

      <section id="catalogo" className="catalog-section shell">
        <div className="section-heading">
          <span>Catálogo de produtos</span>
        </div>

        <div className="catalog-filters" aria-label="Filtros do catálogo">
          <label>
            <span>Formato</span>
            <select
              value={format}
              onChange={(event) => setFormat(event.target.value as FormatFilter)}
            >
              <option value="todos">Todos</option>
              <option value="fisico">Livros físicos</option>
              <option value="ebook">E-books</option>
              <option value="kit">Kits</option>
            </select>
          </label>
          <label>
            <span>Categoria</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="todas">Todas</option>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Tag</span>
            <select value={tag} onChange={(event) => setTag(event.target.value)}>
              <option value="todas">Todas</option>
              {tags.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <span className="result-count">
            {visible.length} produto{visible.length === 1 ? "" : "s"}
          </span>
        </div>

        {visible.length > 0 ? (
          <div className="product-grid">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>Nenhum produto encontrado</h2>
            <p>Altere os filtros ou o termo da busca para ver outros títulos.</p>
          </div>
        )}
      </section>
    </main>
  );
}
