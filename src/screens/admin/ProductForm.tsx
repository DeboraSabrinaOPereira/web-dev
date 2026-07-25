"use client";

import { useState } from "react";
import { FaImage, FaSave, FaTimes } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { useStore } from "../../contexts/StoreContext";
import type { Product, ProductStatus, ProductType } from "../../types";

interface EditableProduct {
  id: string;
  title: string;
  author: string;
  type: ProductType;
  price: string;
  stock: string;
  category: string;
  tags: string;
  image: string;
  description: string;
  status: ProductStatus;
  downloadFile?: string;
}

function toEditable(product: Product): EditableProduct {
  return {
    ...product,
    price: String(product.price),
    stock: product.stock === null ? "" : String(product.stock),
    tags: product.tags.join(", "),
  };
}

export default function ProductForm({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const { nextProductId, upsertProduct } = useStore();
  const [form, setForm] = useState<EditableProduct>(
    product
      ? toEditable(product)
      : {
          id: nextProductId(),
          title: "",
          author: "",
          type: "fisico",
          price: "",
          stock: "0",
          category: "",
          tags: "",
          image: "/images/book-10.png",
          description: "",
          status: "ativo",
        },
  );
  const [error, setError] = useState("");

  function setField<K extends keyof EditableProduct>(
    field: K,
    value: EditableProduct[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setField("image", String(reader.result));
    reader.readAsDataURL(file);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!user) return;

    const price = Number(form.price.replace(",", "."));
    const tags = form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (!form.title.trim()) return setError("Informe o título.");
    if (!form.author.trim()) return setError("Informe o autor.");
    if (!form.category.trim()) return setError("Informe a categoria.");
    if (tags.length === 0) return setError("Informe ao menos uma tag.");
    if (!Number.isFinite(price) || price <= 0) {
      return setError("Informe um preço válido.");
    }

    upsertProduct(
      {
        id: form.id,
        title: form.title.trim(),
        author: form.author.trim(),
        type: form.type,
        price,
        stock:
          form.type === "ebook"
            ? null
            : Math.max(0, Number.parseInt(form.stock, 10) || 0),
        category: form.category.trim(),
        tags,
        image: form.image || "/images/book-10.png",
        description: form.description.trim(),
        status: form.status,
        downloadFile: form.downloadFile,
      },
      user.name,
    );
    onClose();
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <form
        className="product-form"
        onSubmit={handleSubmit}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <span className="eyebrow">{product ? "Editar" : "Cadastrar"}</span>
            <h2>{product ? product.title : "Novo produto"}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar formulário">
            <FaTimes aria-hidden="true" />
          </button>
        </header>

        <div className="product-form-body">
          <div className="form-grid two-columns">
            <label>
              <span>Título</span>
              <input
                value={form.title}
                onChange={(event) => setField("title", event.target.value)}
              />
            </label>
            <label>
              <span>Código</span>
              <input value={form.id} disabled />
            </label>
          </div>
          <label>
            <span>Autor(es)</span>
            <input
              value={form.author}
              onChange={(event) => setField("author", event.target.value)}
            />
          </label>
          <label>
            <span>Descrição</span>
            <textarea
              rows={3}
              value={form.description}
              onChange={(event) => setField("description", event.target.value)}
            />
          </label>
          <div className="form-grid four-columns">
            <label>
              <span>Formato</span>
              <select
                value={form.type}
                onChange={(event) =>
                  setField("type", event.target.value as ProductType)
                }
              >
                <option value="fisico">Livro físico</option>
                <option value="ebook">E-book</option>
                <option value="kit">Kit</option>
              </select>
            </label>
            <label>
              <span>Preço (R$)</span>
              <input
                value={form.price}
                onChange={(event) => setField("price", event.target.value)}
                inputMode="decimal"
              />
            </label>
            <label>
              <span>Estoque</span>
              <input
                value={form.type === "ebook" ? "" : form.stock}
                onChange={(event) =>
                  setField("stock", event.target.value.replace(/\D/g, ""))
                }
                disabled={form.type === "ebook"}
                inputMode="numeric"
              />
            </label>
            <label>
              <span>Status</span>
              <select
                value={form.status}
                onChange={(event) =>
                  setField("status", event.target.value as ProductStatus)
                }
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </label>
          </div>
          <div className="form-grid two-columns">
            <label>
              <span>Categoria</span>
              <input
                value={form.category}
                onChange={(event) => setField("category", event.target.value)}
                placeholder="Ex.: Inteligência Artificial"
              />
            </label>
            <label>
              <span>Tags separadas por vírgula</span>
              <input
                value={form.tags}
                onChange={(event) => setField("tags", event.target.value)}
                placeholder="Ex.: Machine Learning, Python"
              />
            </label>
          </div>
          <div className="image-upload">
            <label>
              <span>
                <FaImage aria-hidden="true" /> Imagem do produto
              </span>
              <input type="file" accept="image/*" onChange={handleImage} />
            </label>
            <img src={form.image} alt="Prévia da imagem do produto" />
          </div>
          {error && <p className="form-error">{error}</p>}
        </div>

        <footer>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn">
            <FaSave aria-hidden="true" /> Salvar produto
          </button>
        </footer>
      </form>
    </div>
  );
}
