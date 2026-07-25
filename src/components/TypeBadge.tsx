import type { ProductType } from "../types";

const LABELS: Record<ProductType, string> = {
  fisico: "Livro físico",
  ebook: "E-book",
  kit: "Kit",
};

export default function TypeBadge({ type }: { type: ProductType }) {
  return <span className={`type-badge type-${type}`}>{LABELS[type]}</span>;
}
