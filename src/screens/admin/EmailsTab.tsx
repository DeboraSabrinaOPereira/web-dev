"use client";

import { useState } from "react";
import { FaChevronDown, FaChevronUp, FaEnvelope } from "react-icons/fa";
import { useStore } from "../../contexts/StoreContext";
import { formatDateTime } from "../../lib/format";

export default function EmailsTab() {
  const { emails } = useStore();
  const [openId, setOpenId] = useState<string | null>(null);

  if (emails.length === 0) {
    return (
      <div className="empty-state">
        <h2>Nenhum e-mail registrado</h2>
        <p>Notificações de pedidos e pagamentos aparecerão nesta caixa de saída.</p>
      </div>
    );
  }

  return (
    <div className="email-list">
      <p className="admin-note">
        Caixa de saída simulada: nenhuma mensagem real é enviada.
      </p>
      {emails.map((email) => {
        const open = openId === email.id;
        return (
          <article key={email.id}>
            <button
              type="button"
              className="email-summary"
              onClick={() => setOpenId(open ? null : email.id)}
            >
              <FaEnvelope aria-hidden="true" />
              <span>
                <strong>{email.subject}</strong>
                <small>
                  Para {email.to} - {formatDateTime(email.createdAt)}
                </small>
              </span>
              <b>{email.status}</b>
              {open ? (
                <FaChevronUp aria-hidden="true" />
              ) : (
                <FaChevronDown aria-hidden="true" />
              )}
            </button>
            {open && <pre>{email.body}</pre>}
          </article>
        );
      })}
    </div>
  );
}
