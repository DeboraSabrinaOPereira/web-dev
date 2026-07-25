"use client";

import { useAuth } from "../../contexts/AuthContext";
import {
  ORDER_STATUSES,
  useStore,
} from "../../contexts/StoreContext";
import { formatBRL, formatDateTime } from "../../lib/format";
import type { OrderStatus } from "../../types";

export default function OrdersTab() {
  const { user } = useAuth();
  const { orders, updateOrderStatus } = useStore();

  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <h2>Nenhum pedido registrado</h2>
        <p>As compras finalizadas aparecerão aqui para acompanhamento.</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="admin-table orders-table">
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Cliente</th>
            <th>Itens</th>
            <th>Entrega</th>
            <th>Pagamento</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td data-label="Pedido">
                <strong>{order.id}</strong>
                <small>{formatDateTime(order.createdAt)}</small>
              </td>
              <td data-label="Cliente">
                <strong>{order.customer.name}</strong>
                <small>{order.customer.email}</small>
              </td>
              <td data-label="Itens">
                {order.items.map((item) => (
                  <small key={item.id}>
                    {item.quantity}x {item.title}
                  </small>
                ))}
              </td>
              <td data-label="Entrega">
                <strong>{order.shipping.label}</strong>
                <small>{order.shipping.carrier}</small>
                {order.address && (
                  <small>
                    {order.address.street}, {order.address.number} -{" "}
                    {order.address.city}/{order.address.state}
                  </small>
                )}
              </td>
              <td data-label="Pagamento">
                <strong>
                  {order.payment.method === "pix"
                    ? "PIX"
                    : `${order.payment.brand} final ${order.payment.last4}`}
                </strong>
                <small>Gateway simulado</small>
              </td>
              <td data-label="Total">
                <strong>{formatBRL(order.total)}</strong>
              </td>
              <td data-label="Status">
                <select
                  value={order.status}
                  onChange={(event) =>
                    user &&
                    updateOrderStatus(
                      order.id,
                      event.target.value as OrderStatus,
                      user.name,
                    )
                  }
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
