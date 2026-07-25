"use client";

import { useMemo, useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import TypeBadge from "../../components/TypeBadge";
import { useAuth } from "../../contexts/AuthContext";
import { useStore } from "../../contexts/StoreContext";
import { formatBRL } from "../../lib/format";
import type { Product } from "../../types";
import ProductForm from "./ProductForm";

export default function ProductsTab() {
  const { user } = useAuth();
  const { products, deleteProduct } = useStore();
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [category, setCategory] = useState("todas");

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))].sort(),
    [products],
  );
  const visible =
    category === "todas"
      ? products
      : products.filter((product) => product.category === category);

  function handleDelete(product: Product) {
    if (!user) return;
    if (
      window.confirm(
        `Excluir "${product.title}"? O produto sairá do catálogo desta demonstração.`,
      )
    ) {
      deleteProduct(product.id, user.name);
    }
  }

  return (
    <>
      <div className="admin-toolbar">
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
        <button type="button" className="btn" onClick={() => setEditing("new")}>
          <FaPlus aria-hidden="true" /> Novo produto
        </button>
      </div>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Capa</th>
              <th>Produto</th>
              <th>Formato</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Categoria e tags</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((product) => (
              <tr key={product.id}>
                <td data-label="Capa">
                  <img
                    className="admin-cover"
                    src={product.image}
                    alt={`Capa de ${product.title}`}
                  />
                </td>
                <td data-label="Produto">
                  <strong>{product.title}</strong>
                  <small>
                    {product.id} - {product.author}
                  </small>
                </td>
                <td data-label="Formato">
                  <TypeBadge type={product.type} />
                </td>
                <td data-label="Preço">{formatBRL(product.price)}</td>
                <td data-label="Estoque">
                  {product.stock === null ? "Digital" : product.stock}
                </td>
                <td data-label="Categoria e tags">
                  <strong>{product.category}</strong>
                  <small>{product.tags.join(", ")}</small>
                </td>
                <td data-label="Status">
                  <span className={`product-status ${product.status}`}>
                    {product.status}
                  </span>
                </td>
                <td data-label="Ações">
                  <div className="table-actions">
                    <button
                      type="button"
                      onClick={() => setEditing(product)}
                      aria-label={`Editar ${product.title}`}
                    >
                      <FaEdit aria-hidden="true" /> Editar
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => handleDelete(product)}
                      aria-label={`Excluir ${product.title}`}
                    >
                      <FaTrash aria-hidden="true" /> Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="admin-note">
        Novos produtos e categorias podem ser cadastrados pelo formulário, sem
        alteração no código.
      </p>

      {editing && (
        <ProductForm
          product={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
