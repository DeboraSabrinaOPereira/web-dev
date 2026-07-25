"use client";

import { useState } from "react";
import {
  FaBoxOpen,
  FaClipboardList,
  FaEnvelope,
  FaHistory,
} from "react-icons/fa";
import { ROLE_LABELS, useAuth } from "../../contexts/AuthContext";
import { AppLink } from "../../contexts/NavigationContext";
import { useStore } from "../../contexts/StoreContext";
import EmailsTab from "./EmailsTab";
import LogsTab from "./LogsTab";
import OrdersTab from "./OrdersTab";
import ProductsTab from "./ProductsTab";

type TabId = "produtos" | "pedidos" | "emails" | "logs";

const TABS = [
  {
    id: "produtos" as const,
    label: "Produtos",
    icon: FaBoxOpen,
    roles: ["admin", "editor"],
  },
  {
    id: "pedidos" as const,
    label: "Pedidos",
    icon: FaClipboardList,
    roles: ["admin", "vendedor"],
  },
  {
    id: "emails" as const,
    label: "E-mails",
    icon: FaEnvelope,
    roles: ["admin", "vendedor"],
  },
  {
    id: "logs" as const,
    label: "Logs",
    icon: FaHistory,
    roles: ["admin"],
  },
];

export default function Admin() {
  const { user, role } = useAuth();
  const { products, orders, emails, logs } = useStore();
  const [tab, setTab] = useState<TabId>("produtos");

  if (!user || !role) {
    return (
      <main className="page shell centered-page">
        <h1>Painel administrativo</h1>
        <p>Entre com um perfil de administrador, editor ou vendedor.</p>
        <AppLink to="/login" className="btn">
          Entrar
        </AppLink>
      </main>
    );
  }

  if (role === "cliente") {
    return (
      <main className="page shell centered-page">
        <h1>Acesso restrito à equipe</h1>
        <AppLink to="/conta" className="btn">
          Ir para minha conta
        </AppLink>
      </main>
    );
  }

  const allowedTabs = TABS.filter((item) => item.roles.includes(role));
  const activeTab = allowedTabs.some((item) => item.id === tab)
    ? tab
    : allowedTabs[0].id;
  const pending = orders.filter((order) => order.status === "Pendente").length;

  return (
    <main className="page shell admin-page">
      <header className="admin-heading">
        <div>
          <span className="eyebrow">Gestão COMPIA</span>
          <h1>Painel administrativo</h1>
          <p>
            Sessão de <strong>{user.name}</strong> - {ROLE_LABELS[role]}
          </p>
        </div>
        <div className="admin-stats">
          <span>
            <b>{products.length}</b> produtos
          </span>
          <span>
            <b>{orders.length}</b> pedidos
          </span>
          <span>
            <b>{pending}</b> pendentes
          </span>
          <span>
            <b>{emails.length}</b> e-mails
          </span>
          {role === "admin" && (
            <span>
              <b>{logs.length}</b> logs
            </span>
          )}
        </div>
      </header>

      <nav className="admin-tabs" aria-label="Seções do painel">
        {allowedTabs.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              className={activeTab === item.id ? "active" : ""}
              onClick={() => setTab(item.id)}
            >
              <Icon aria-hidden="true" />
              {item.label}
              {item.id === "pedidos" && pending > 0 && <b>{pending}</b>}
            </button>
          );
        })}
      </nav>

      <section className="admin-content">
        {activeTab === "produtos" && <ProductsTab />}
        {activeTab === "pedidos" && <OrdersTab />}
        {activeTab === "emails" && <EmailsTab />}
        {activeTab === "logs" && <LogsTab />}
      </section>
    </main>
  );
}
