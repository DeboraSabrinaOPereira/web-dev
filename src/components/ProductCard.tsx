"use client";

import { useState } from "react";
import { FaEye, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../contexts/CartContext";
import { AppLink } from "../contexts/NavigationContext";
import { formatBRL } from "../lib/format";
import type { Product } from "../types";
import TypeBadge from "./TypeBadge";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const outOfStock = product.type !== "ebook" && product.stock === 0;

  function handleAdd() {
    addItem(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <article className="product-card">
      <div className="product-card-tools">
        <AppLink
          to={`/produto/${product.id}`}
          ariaLabel={`Ver detalhes de ${product.title}`}
        >
          <FaEye aria-hidden="true" />
        </AppLink>
        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock}
          aria-label={`Adicionar ${product.title} ao carrinho`}
        >
          <FaShoppingCart aria-hidden="true" />
        </button>
      </div>
      <AppLink
        to={`/produto/${product.id}`}
        className="product-image"
        ariaLabel={`Abrir ${product.title}`}
      >
        <img src={product.image} alt={`Capa de ${product.title}`} />
      </AppLink>
      <div className="product-card-content">
        <TypeBadge type={product.type} />
        <h3>
          <AppLink to={`/produto/${product.id}`}>{product.title}</AppLink>
        </h3>
        <p>{product.author}</p>
        <div className="product-price">{formatBRL(product.price)}</div>
        {outOfStock ? (
          <span className="stock-warning">Esgotado</span>
        ) : (
          <button type="button" className="btn" onClick={handleAdd}>
            {added ? "Adicionado" : "Adicionar ao carrinho"}
          </button>
        )}
      </div>
    </article>
  );
}
