"use client";

import { useState } from "react";
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import TypeBadge from "../components/TypeBadge";
import { useCart } from "../contexts/CartContext";
import {
  AppLink,
  useNavigation,
} from "../contexts/NavigationContext";
import { useStore } from "../contexts/StoreContext";
import { formatBRL } from "../lib/format";

export default function ProductDetail({ productId }: { productId: string }) {
  const { products } = useStore();
  const { addItem } = useCart();
  const { navigate } = useNavigation();
  const [added, setAdded] = useState(false);
  const product = products.find((item) => item.id === productId);

  if (!product) {
    return (
      <main className="page shell centered-page">
        <h1>Produto não encontrado</h1>
        <AppLink to="/" className="text-link">
          Voltar ao catálogo
        </AppLink>
      </main>
    );
  }

  const outOfStock = product.type !== "ebook" && product.stock === 0;

  function handleAdd(goToCart = false) {
    if (!product) return;
    addItem(product);
    if (goToCart) {
      navigate("/carrinho");
      return;
    }
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <main className="page shell">
      <AppLink to="/" className="back-link">
        <FaArrowLeft aria-hidden="true" /> Voltar ao catálogo
      </AppLink>

      <div className="product-detail">
        <div className="detail-cover">
          <img src={product.image} alt={`Capa de ${product.title}`} />
        </div>
        <div className="detail-content">
          <TypeBadge type={product.type} />
          <span className="detail-category">{product.category}</span>
          <h1>{product.title}</h1>
          <p className="detail-author">por {product.author}</p>
          <p className="detail-price">{formatBRL(product.price)}</p>
          <p className="detail-delivery">
            {product.type === "ebook"
              ? "Entrega digital por link após a confirmação do pagamento."
              : product.type === "kit"
                ? "Kit com envio físico e material digital liberado na conta."
                : outOfStock
                  ? "Produto temporariamente esgotado."
                  : `${product.stock} unidade(s) em estoque.`}
          </p>

          <div className="detail-actions">
            <button
              type="button"
              className="btn"
              onClick={() => handleAdd()}
              disabled={outOfStock}
            >
              <FaShoppingCart aria-hidden="true" />
              {added ? "Adicionado" : "Adicionar ao carrinho"}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => handleAdd(true)}
              disabled={outOfStock}
            >
              Comprar agora
            </button>
          </div>

          <section className="detail-section">
            <h2>Sobre a obra</h2>
            <p>{product.description}</p>
          </section>
          <section className="detail-section">
            <h2>Informações</h2>
            <dl>
              <dt>Código</dt>
              <dd>{product.id}</dd>
              <dt>Formato</dt>
              <dd>
                {product.type === "fisico"
                  ? "Livro físico"
                  : product.type === "ebook"
                    ? "E-book"
                    : "Kit"}
              </dd>
              <dt>Categoria</dt>
              <dd>{product.category}</dd>
              <dt>Tags</dt>
              <dd>{product.tags.join(", ")}</dd>
            </dl>
          </section>
        </div>
      </div>
    </main>
  );
}
