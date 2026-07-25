"use client";

import { FaDownload, FaHistory, FaUserCircle } from "react-icons/fa";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../contexts/AuthContext";
import { AppLink } from "../contexts/NavigationContext";
import { useStore } from "../contexts/StoreContext";
import { formatBRL, formatDateTime } from "../lib/format";

export default function MyAccount() {
  const { user, role } = useAuth();
  const { orders } = useStore();

  if (!user) {
    return (
      <main className="page shell centered-page">
        <h1>Área do cliente</h1>
        <p>Entre com a conta de cliente para consultar compras e downloads.</p>
        <AppLink to="/login" className="btn">
          Entrar
        </AppLink>
      </main>
    );
  }

  if (role !== "cliente") {
    return (
      <main className="page shell centered-page">
        <h1>Este perfil usa o painel administrativo</h1>
        <AppLink to="/admin" className="btn">
          Abrir painel
        </AppLink>
      </main>
    );
  }

  const myOrders = orders.filter(
    (order) => order.customer.email.toLowerCase() === user.email.toLowerCase(),
  );
  const downloads = myOrders
    .filter((order) => order.status === "Pago" || order.status === "Entregue")
    .flatMap((order) =>
      order.items
        .filter((item) => item.type === "ebook" || item.downloadFile)
        .map((item) => ({ ...item, orderId: order.id })),
    );

  return (
    <main className="page shell account-page">
      <div className="page-title">
        <span>Minha conta</span>
      </div>

      <section className="profile-card">
        <FaUserCircle aria-hidden="true" />
        <div>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </div>
      </section>

      <section className="account-section">
        <h2>
          <FaHistory aria-hidden="true" /> Histórico de compras
        </h2>
        {myOrders.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum pedido encontrado para esta conta.</p>
            <AppLink to="/" className="text-link">
              Conhecer o catálogo
            </AppLink>
          </div>
        ) : (
          <div className="order-list">
            {myOrders.map((order) => (
              <article key={order.id} className="account-order">
                <header>
                  <div>
                    <strong>{order.id}</strong>
                    <span>{formatDateTime(order.createdAt)}</span>
                  </div>
                  <StatusBadge status={order.status} />
                </header>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.id}>
                      <span>
                        {item.quantity}x {item.title}
                      </span>
                      <b>{formatBRL(item.price * item.quantity)}</b>
                    </li>
                  ))}
                </ul>
                <footer>
                  <span>
                    {order.shipping.label} - {order.shipping.carrier}
                  </span>
                  <strong>Total: {formatBRL(order.total)}</strong>
                </footer>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="account-section">
        <h2>
          <FaDownload aria-hidden="true" /> Meus e-books
        </h2>
        {downloads.length === 0 ? (
          <p className="section-note">
            Os downloads aparecem aqui após a confirmação do pagamento.
          </p>
        ) : (
          <ul className="download-list">
            {downloads.map((item) => (
              <li key={`${item.orderId}-${item.id}`}>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.orderId}</small>
                </span>
                <a
                  href={`/downloads/${item.downloadFile ?? "aprendizado-de-maquina-na-pratica.pdf"}`}
                  download
                  className="btn btn-outline"
                >
                  <FaDownload aria-hidden="true" /> Baixar PDF
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
