"use client";

import { useState } from "react";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import TypeBadge from "../components/TypeBadge";
import { useCart } from "../contexts/CartContext";
import {
  AppLink,
  useNavigation,
} from "../contexts/NavigationContext";
import { formatBRL, maskCEP } from "../lib/format";
import { quoteShipping } from "../lib/shipping";
import { saveJSON } from "../lib/storage";
import {
  calculateTaxes,
  DIGITAL_TAX_RATE,
  hasPhysicalItems,
  PHYSICAL_TAX_RATE,
} from "../lib/taxes";
import type { CheckoutDraft, ShippingOption } from "../types";

const DIGITAL_SHIPPING: ShippingOption = {
  id: "digital",
  label: "Entrega digital",
  carrier: "Área do cliente",
  price: 0,
  days: 0,
  kind: "digital",
};

export default function Cart() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const { navigate } = useNavigation();
  const [cep, setCep] = useState("");
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [selected, setSelected] = useState<ShippingOption | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [error, setError] = useState("");

  const physical = hasPhysicalItems(items);
  const physicalCount = items
    .filter((item) => item.type !== "ebook")
    .reduce((total, item) => total + item.quantity, 0);
  const taxes = calculateTaxes(items);
  const shipping = physical ? selected : DIGITAL_SHIPPING;
  const total = subtotal + taxes.total + (shipping?.price ?? 0);

  async function handleQuote(event: React.FormEvent) {
    event.preventDefault();
    setQuoting(true);
    setError("");
    setOptions([]);
    setSelected(null);
    try {
      const result = await quoteShipping(cep, physicalCount);
      setOptions(result);
    } catch (quoteError) {
      setError(
        quoteError instanceof Error ? quoteError.message : "Não foi possível cotar.",
      );
    } finally {
      setQuoting(false);
    }
  }

  function goToCheckout() {
    if (!shipping) return;
    const draft: CheckoutDraft = {
      shipping,
      cep: shipping.kind === "delivery" ? maskCEP(cep) : "",
    };
    saveJSON("checkoutDraft", draft);
    navigate("/checkout");
  }

  if (items.length === 0) {
    return (
      <main className="page shell centered-page">
        <h1>Seu carrinho está vazio</h1>
        <p>Adicione títulos do catálogo para começar uma compra.</p>
        <AppLink to="/" className="btn">
          Ver catálogo
        </AppLink>
      </main>
    );
  }

  return (
    <main className="page shell">
      <div className="page-title">
        <span>Seu pedido</span>
      </div>

      <div className="cart-layout">
        <div>
          <section className="cart-items" aria-label="Itens do carrinho">
            {items.map((item) => (
              <article className="cart-item" key={item.id}>
                <img src={item.image} alt="" />
                <div className="cart-item-info">
                  <AppLink to={`/produto/${item.id}`}>
                    <h2>{item.title}</h2>
                  </AppLink>
                  <TypeBadge type={item.type} />
                  <span className="unit-price">{formatBRL(item.price)} cada</span>
                </div>
                <div className="quantity-control">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    aria-label="Diminuir quantidade"
                  >
                    <FaMinus aria-hidden="true" />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    aria-label="Aumentar quantidade"
                  >
                    <FaPlus aria-hidden="true" />
                  </button>
                </div>
                <strong>{formatBRL(item.price * item.quantity)}</strong>
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remover ${item.title}`}
                >
                  <FaTrash aria-hidden="true" />
                </button>
              </article>
            ))}
          </section>

          {physical && (
            <section className="shipping-card">
              <h2>Calcular frete</h2>
              <p>
                Cotação simulada para Correios, transportadora e retirada na
                editora.
              </p>
              <form onSubmit={handleQuote} className="shipping-form">
                <input
                  value={cep}
                  onChange={(event) => setCep(maskCEP(event.target.value))}
                  placeholder="00000-000"
                  inputMode="numeric"
                  aria-label="CEP"
                />
                <button type="submit" className="btn btn-outline" disabled={quoting}>
                  {quoting ? "Calculando..." : "Calcular"}
                </button>
              </form>
              {error && <p className="form-error">{error}</p>}
              {options.length > 0 && (
                <div className="shipping-options">
                  {options.map((option) => (
                    <label key={option.id}>
                      <input
                        type="radio"
                        name="shipping"
                        checked={selected?.id === option.id}
                        onChange={() => setSelected(option)}
                      />
                      <span>
                        <strong>{option.label}</strong>
                        <small>
                          {option.carrier}
                          {option.days > 0
                            ? ` - até ${option.days} dias úteis`
                            : " - agendamento após a compra"}
                        </small>
                      </span>
                      <b>
                        {option.price === 0 ? "Grátis" : formatBRL(option.price)}
                      </b>
                    </label>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        <aside className="order-summary">
          <h2>Resumo</h2>
          <dl>
            <div>
              <dt>Subtotal</dt>
              <dd>{formatBRL(subtotal)}</dd>
            </div>
            {taxes.physical > 0 && (
              <div>
                <dt>Imposto físico ({PHYSICAL_TAX_RATE * 100}%)</dt>
                <dd>{formatBRL(taxes.physical)}</dd>
              </div>
            )}
            {taxes.digital > 0 && (
              <div>
                <dt>Imposto digital ({DIGITAL_TAX_RATE * 100}%)</dt>
                <dd>{formatBRL(taxes.digital)}</dd>
              </div>
            )}
            <div>
              <dt>Frete</dt>
              <dd>
                {!shipping
                  ? "Selecione"
                  : shipping.price === 0
                    ? "Grátis"
                    : formatBRL(shipping.price)}
              </dd>
            </div>
            <div className="summary-total">
              <dt>Total</dt>
              <dd>{shipping ? formatBRL(total) : "-"}</dd>
            </div>
          </dl>
          <button
            type="button"
            className="btn full-button"
            onClick={goToCheckout}
            disabled={!shipping}
          >
            Ir para o checkout
          </button>
          {physical && !shipping && (
            <p className="summary-note">
              Informe o CEP e selecione uma forma de entrega.
            </p>
          )}
          <AppLink to="/" className="continue-link">
            Continuar comprando
          </AppLink>
        </aside>
      </div>
    </main>
  );
}
