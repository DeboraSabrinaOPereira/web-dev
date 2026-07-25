"use client";

import { useState } from "react";
import { FaCheckCircle, FaCopy, FaDownload } from "react-icons/fa";
import QrCodeMock from "../components/QrCodeMock";
import StatusBadge from "../components/StatusBadge";
import { AppLink } from "../contexts/NavigationContext";
import { useStore } from "../contexts/StoreContext";
import { formatBRL, formatDateTime } from "../lib/format";

export default function OrderConfirmed({ orderId }: { orderId: string }) {
  const { orders } = useStore();
  const [copied, setCopied] = useState(false);
  const order = orders.find((item) => item.id === orderId);

  if (!order) {
    return (
      <main className="page shell centered-page">
        <h1>Pedido não encontrado</h1>
        <AppLink to="/" className="btn">
          Voltar ao catálogo
        </AppLink>
      </main>
    );
  }

  const digitalItems = order.items.filter(
    (item) => item.type === "ebook" || item.downloadFile,
  );
  const pendingPix =
    order.payment.method === "pix" && order.status === "Pendente";
  const pixKey = order.payment.pixKey;

  async function copyPix() {
    if (!pixKey) return;
    await navigator.clipboard.writeText(pixKey);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <main className="page shell confirmation-page">
      <section className="confirmation-card">
        <div className="confirmation-icon">
          <FaCheckCircle aria-hidden="true" />
        </div>
        <span className="eyebrow">
          {order.status === "Pago" ? "Pagamento aprovado" : "Pedido recebido"}
        </span>
        <h1>Obrigado pela compra!</h1>
        <p>
          O comprovante foi registrado para <strong>{order.customer.email}</strong>.
          Acompanhe as atualizações pela área do cliente.
        </p>

        {pendingPix && pixKey && (
          <section className="pix-box">
            <h2>Pague com PIX</h2>
            <div className="pix-content">
              <QrCodeMock value={pixKey} />
              <div>
                <p>
                  Escaneie o QR Code de demonstração ou copie a chave abaixo. A
                  aprovação é simulada pelo vendedor ou administrador no painel.
                </p>
                <code>{pixKey}</code>
                <button type="button" className="btn btn-outline" onClick={copyPix}>
                  <FaCopy aria-hidden="true" /> {copied ? "Copiado" : "Copiar chave"}
                </button>
              </div>
            </div>
          </section>
        )}

        <dl className="order-details">
          <div>
            <dt>Pedido</dt>
            <dd>{order.id}</dd>
          </div>
          <div>
            <dt>Data</dt>
            <dd>{formatDateTime(order.createdAt)}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              <StatusBadge status={order.status} />
            </dd>
          </div>
          <div>
            <dt>Pagamento</dt>
            <dd>
              {order.payment.method === "pix"
                ? "PIX"
                : `${order.payment.brand} final ${order.payment.last4}`}
            </dd>
          </div>
          <div>
            <dt>Entrega</dt>
            <dd>
              {order.shipping.label} - {order.shipping.carrier}
            </dd>
          </div>
          <div>
            <dt>Total</dt>
            <dd>{formatBRL(order.total)}</dd>
          </div>
        </dl>

        {digitalItems.length > 0 && (
          <section className="download-section">
            <h2>Materiais digitais</h2>
            {order.status === "Pago" ? (
              <ul>
                {digitalItems.map((item) => (
                  <li key={item.id}>
                    <span>{item.title}</span>
                    <a
                      href={`/downloads/${item.downloadFile ?? "aprendizado-de-maquina-na-pratica.pdf"}`}
                      download
                      className="btn btn-outline"
                    >
                      <FaDownload aria-hidden="true" /> Baixar
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                Os links serão liberados automaticamente quando o pagamento PIX
                for marcado como pago.
              </p>
            )}
          </section>
        )}

        <div className="confirmation-actions">
          <AppLink to="/conta" className="btn">
            Acompanhar pedido
          </AppLink>
          <AppLink to="/" className="btn btn-outline">
            Continuar comprando
          </AppLink>
        </div>
      </section>
    </main>
  );
}
