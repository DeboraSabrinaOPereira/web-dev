"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { seedProducts } from "../data/products";
import { loadJSON, saveJSON } from "../lib/storage";
import type {
  ActivityLog,
  EmailRecord,
  Order,
  OrderStatus,
  Product,
} from "../types";

export const ORDER_STATUSES: OrderStatus[] = [
  "Pendente",
  "Pago",
  "Em separação",
  "Enviado",
  "Entregue",
  "Cancelado",
];

function id(prefix: string) {
  const value =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${value}`;
}

interface StoreValue {
  products: Product[];
  orders: Order[];
  emails: EmailRecord[];
  logs: ActivityLog[];
  upsertProduct: (product: Product, actor: string) => void;
  deleteProduct: (productId: string, actor: string) => void;
  nextProductId: () => string;
  createOrder: (order: Order) => void;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    actor: string,
  ) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [orders, setOrders] = useState<Order[]>([]);
  const [emails, setEmails] = useState<EmailRecord[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setProducts(loadJSON<Product[]>("products", seedProducts));
      setOrders(loadJSON<Order[]>("orders", []));
      setEmails(loadJSON<EmailRecord[]>("emails", []));
      setLogs(loadJSON<ActivityLog[]>("logs", []));
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveJSON("products", products);
    saveJSON("orders", orders);
    saveJSON("emails", emails);
    saveJSON("logs", logs);
  }, [emails, hydrated, logs, orders, products]);

  function addLog(actor: string, action: string) {
    setLogs((current) => [
      {
        id: id("LOG"),
        createdAt: new Date().toISOString(),
        actor,
        action,
      },
      ...current,
    ]);
  }

  function queueEmail(to: string, subject: string, body: string) {
    setEmails((current) => [
      {
        id: id("MAIL"),
        createdAt: new Date().toISOString(),
        to,
        subject,
        body,
        status: "simulado",
      },
      ...current,
    ]);
  }

  function queueEbookEmail(order: Order) {
    const ebooks = order.items.filter(
      (item) => item.type === "ebook" || item.downloadFile,
    );
    if (ebooks.length === 0) return;
    const list = ebooks.map((item) => `- ${item.title}`).join("\n");
    queueEmail(
      order.customer.email,
      `[COMPIA] E-books liberados - ${order.id}`,
      `Olá, ${order.customer.name}.\n\nSeus materiais digitais estão disponíveis na área do cliente:\n${list}\n\nEditora COMPIA`,
    );
  }

  const value: StoreValue = {
    products,
    orders,
    emails,
    logs,
    upsertProduct(product, actor) {
        const exists = products.some((item) => item.id === product.id);
        setProducts((current) =>
          exists
            ? current.map((item) => (item.id === product.id ? product : item))
            : [...current, product],
        );
        addLog(
          actor,
          exists
            ? `Editou o produto ${product.id} - ${product.title}`
            : `Cadastrou o produto ${product.id} - ${product.title}`,
        );
    },
    deleteProduct(productId, actor) {
        const product = products.find((item) => item.id === productId);
        setProducts((current) =>
          current.filter((item) => item.id !== productId),
        );
        addLog(
          actor,
          `Excluiu o produto ${productId}${product ? ` - ${product.title}` : ""}`,
        );
    },
    nextProductId() {
        const largest = products.reduce((current, product) => {
          const number = Number(product.id.replace(/\D/g, ""));
          return Number.isNaN(number) ? current : Math.max(current, number);
        }, 0);
        return `CMP-${String(largest + 1).padStart(4, "0")}`;
    },
    createOrder(order) {
        setOrders((current) => [order, ...current]);
        setProducts((current) =>
          current.map((product) => {
            const purchased = order.items.find((item) => item.id === product.id);
            if (!purchased || product.stock === null) return product;
            return {
              ...product,
              stock: Math.max(0, product.stock - purchased.quantity),
            };
          }),
        );
        addLog(
          order.customer.email,
          `Criou o pedido ${order.id} com pagamento ${order.payment.method.toUpperCase()}`,
        );
        queueEmail(
          order.customer.email,
          `[COMPIA] Pedido recebido - ${order.id}`,
          `Olá, ${order.customer.name}.\n\nRecebemos seu pedido ${order.id}. O status inicial é ${order.status}.\n\nEditora COMPIA`,
        );
        if (order.status === "Pago") {
          queueEmail(
            order.customer.email,
            `[COMPIA] Pagamento aprovado - ${order.id}`,
            `O pagamento do pedido ${order.id} foi aprovado e a preparação já começou.`,
          );
          queueEbookEmail(order);
        }
    },
    updateOrderStatus(orderId, status, actor) {
        const order = orders.find((item) => item.id === orderId);
        if (!order || order.status === status) return;
        setOrders((current) =>
          current.map((item) =>
            item.id === orderId ? { ...item, status } : item,
          ),
        );
        addLog(actor, `Alterou o pedido ${orderId} para ${status}`);
        queueEmail(
          order.customer.email,
          `[COMPIA] Atualização do pedido ${orderId}`,
          `Olá, ${order.customer.name}.\n\nO status do seu pedido agora é: ${status}.`,
        );
        if (status === "Pago" && order.status === "Pendente") {
          queueEbookEmail({ ...order, status });
        }
    },
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) {
    throw new Error("useStore deve ser usado dentro de StoreProvider.");
  }
  return value;
}
