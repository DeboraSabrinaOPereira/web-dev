import type { OrderStatus } from "../types";

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const token = status
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-");
  return <span className={`status-badge status-${token}`}>{status}</span>;
}
