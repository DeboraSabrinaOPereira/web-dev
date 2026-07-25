"use client";

import { useEffect, useMemo, useState } from "react";
import { FaCreditCard, FaMapMarkerAlt, FaQrcode } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import {
  AppLink,
  useNavigation,
} from "../contexts/NavigationContext";
import { useStore } from "../contexts/StoreContext";
import { formatBRL, maskCardNumber, maskExpiry } from "../lib/format";
import {
  createPixKey,
  detectCardBrand,
  expiryValid,
  luhnValid,
} from "../lib/payment";
import { loadJSON, saveJSON } from "../lib/storage";
import { calculateTaxes } from "../lib/taxes";
import type {
  Address,
  CheckoutDraft,
  Order,
  Payment,
} from "../types";

function newOrderId() {
  const today = new Date();
  const date = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("");
  return `PED-${date}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

const initialAddress: Address = {
  cep: "",
  street: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  state: "",
};

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useStore();
  const { navigate } = useNavigation();

  const [draft, setDraft] = useState<CheckoutDraft | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState<Address>(initialAddress);
  const [method, setMethod] = useState<"cartao" | "pix">("cartao");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const saved = loadJSON<CheckoutDraft | null>("checkoutDraft", null);
      setDraft(saved);
      if (saved?.cep) {
        setAddress((current) => ({ ...current, cep: saved.cep }));
      }
      setLoaded(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!user || user.role !== "cliente") return;
    const frame = window.requestAnimationFrame(() => {
      setName((current) => current || user.name);
      setEmail((current) => current || user.email);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [user]);

  const taxes = useMemo(() => calculateTaxes(items), [items]);
  const total = subtotal + taxes.total + (draft?.shipping.price ?? 0);
  const needsAddress = draft?.shipping.kind === "delivery";
  const isPickup = draft?.shipping.kind === "pickup";
  const brand = detectCardBrand(cardNumber);

  function setAddressField(field: keyof Address, value: string) {
    setAddress((current) => ({ ...current, [field]: value }));
  }

  function validate() {
    const nextErrors: string[] = [];
    if (name.trim().length < 3) nextErrors.push("Informe o nome completo.");
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.push("Informe um e-mail válido.");
    }
    if (needsAddress) {
      if (!address.street.trim()) nextErrors.push("Informe o logradouro.");
      if (!address.number.trim()) nextErrors.push("Informe o número.");
      if (!address.district.trim()) nextErrors.push("Informe o bairro.");
      if (!address.city.trim()) nextErrors.push("Informe a cidade.");
      if (address.state.trim().length !== 2) nextErrors.push("Informe a UF.");
    }
    if (method === "cartao") {
      if (!brand) nextErrors.push("Use um cartão Visa, Mastercard, Elo ou Amex.");
      if (!luhnValid(cardNumber)) nextErrors.push("Número do cartão inválido.");
      if (cardName.trim().length < 3) {
        nextErrors.push("Informe o nome impresso no cartão.");
      }
      if (!expiryValid(expiry)) nextErrors.push("Validade inválida.");
      if (!/^\d{3,4}$/.test(cvv)) nextErrors.push("CVV inválido.");
    }
    return nextErrors;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!draft) return;

    const validationErrors = validate();
    setErrors(validationErrors);
    if (validationErrors.length > 0) return;

    setProcessing(true);
    await new Promise((resolve) => window.setTimeout(resolve, 500));

    const payment: Payment =
      method === "cartao"
        ? {
            method,
            gateway: "mock",
            brand,
            last4: cardNumber.replace(/\D/g, "").slice(-4),
          }
        : {
            method,
            gateway: "mock",
            pixKey: createPixKey(),
          };

    const order: Order = {
      id: newOrderId(),
      createdAt: new Date().toISOString(),
      customer: { name: name.trim(), email: email.trim().toLowerCase() },
      items: items.map((item) => ({ ...item })),
      subtotal,
      taxes,
      shipping: draft.shipping,
      address: needsAddress ? address : null,
      total,
      payment,
      status: method === "cartao" ? "Pago" : "Pendente",
    };

    createOrder(order);
    saveJSON("checkoutDraft", null);
    clearCart();
    navigate(`/pedido/${order.id}`);
  }

  if (!loaded) {
    return (
      <main className="page shell centered-page">
        <p>Preparando o checkout...</p>
      </main>
    );
  }

  if (!draft || items.length === 0) {
    return (
      <main className="page shell centered-page">
        <h1>Nenhum pedido para finalizar</h1>
        <p>Revise seu carrinho e escolha a forma de entrega primeiro.</p>
        <AppLink to="/carrinho" className="btn">
          Voltar ao carrinho
        </AppLink>
      </main>
    );
  }

  return (
    <main className="page shell">
      <div className="page-title">
        <span>Finalizar compra</span>
      </div>

      <form className="checkout-layout" onSubmit={handleSubmit}>
        <div className="checkout-sections">
          <section className="form-card">
            <h2>Dados do comprador</h2>
            <div className="form-grid two-columns">
              <label>
                <span>Nome completo</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                />
              </label>
              <label>
                <span>E-mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                />
              </label>
            </div>
          </section>

          {needsAddress && (
            <section className="form-card">
              <h2>
                <FaMapMarkerAlt aria-hidden="true" /> Endereço de entrega
              </h2>
              <p className="form-hint">CEP selecionado: {address.cep}</p>
              <div className="form-grid address-grid">
                <label className="wide-field">
                  <span>Rua / logradouro</span>
                  <input
                    value={address.street}
                    onChange={(event) =>
                      setAddressField("street", event.target.value)
                    }
                    autoComplete="street-address"
                  />
                </label>
                <label>
                  <span>Número</span>
                  <input
                    value={address.number}
                    onChange={(event) =>
                      setAddressField("number", event.target.value)
                    }
                  />
                </label>
                <label>
                  <span>Complemento</span>
                  <input
                    value={address.complement}
                    onChange={(event) =>
                      setAddressField("complement", event.target.value)
                    }
                  />
                </label>
                <label>
                  <span>Bairro</span>
                  <input
                    value={address.district}
                    onChange={(event) =>
                      setAddressField("district", event.target.value)
                    }
                  />
                </label>
                <label>
                  <span>Cidade</span>
                  <input
                    value={address.city}
                    onChange={(event) =>
                      setAddressField("city", event.target.value)
                    }
                  />
                </label>
                <label>
                  <span>UF</span>
                  <input
                    value={address.state}
                    maxLength={2}
                    onChange={(event) =>
                      setAddressField("state", event.target.value.toUpperCase())
                    }
                  />
                </label>
              </div>
            </section>
          )}

          {isPickup && (
            <section className="form-card pickup-card">
              <h2>
                <FaMapMarkerAlt aria-hidden="true" /> Retirada na editora
              </h2>
              <p>
                Rua Aprígio Veloso, 882 - Bairro Universitário, Campina Grande/PB.
                Após a confirmação, apresente o número do pedido no balcão.
              </p>
            </section>
          )}

          <section className="form-card payment-card">
            <div className="payment-tabs">
              <button
                type="button"
                className={method === "cartao" ? "active" : ""}
                onClick={() => setMethod("cartao")}
              >
                <FaCreditCard aria-hidden="true" /> Cartão
              </button>
              <button
                type="button"
                className={method === "pix" ? "active" : ""}
                onClick={() => setMethod("pix")}
              >
                <FaQrcode aria-hidden="true" /> PIX
              </button>
            </div>

            {method === "cartao" ? (
              <div className="card-fields">
                <div className="card-brands">
                  {["Visa", "Mastercard", "Elo", "American Express"].map(
                    (item) => (
                      <span key={item} className={brand === item ? "active" : ""}>
                        {item}
                      </span>
                    ),
                  )}
                </div>
                <label>
                  <span>Número do cartão</span>
                  <input
                    value={cardNumber}
                    onChange={(event) =>
                      setCardNumber(maskCardNumber(event.target.value))
                    }
                    placeholder="4111 1111 1111 1111"
                    inputMode="numeric"
                    autoComplete="cc-number"
                  />
                </label>
                <label>
                  <span>Nome impresso</span>
                  <input
                    value={cardName}
                    onChange={(event) =>
                      setCardName(event.target.value.toUpperCase())
                    }
                    autoComplete="cc-name"
                  />
                </label>
                <div className="form-grid two-columns">
                  <label>
                    <span>Validade</span>
                    <input
                      value={expiry}
                      onChange={(event) =>
                        setExpiry(maskExpiry(event.target.value))
                      }
                      placeholder="MM/AA"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                    />
                  </label>
                  <label>
                    <span>CVV</span>
                    <input
                      value={cvv}
                      onChange={(event) =>
                        setCvv(event.target.value.replace(/\D/g, "").slice(0, 4))
                      }
                      placeholder="123"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                    />
                  </label>
                </div>
                <p className="form-hint">
                  Simulação: use 4111 1111 1111 1111, qualquer nome, validade
                  futura e CVV de 3 dígitos.
                </p>
              </div>
            ) : (
              <div className="pix-explanation">
                <FaQrcode aria-hidden="true" />
                <div>
                  <h3>Pagamento com PIX</h3>
                  <p>
                    O QR Code e a chave aleatória serão gerados após a confirmação.
                    O pedido ficará pendente até a aprovação no painel.
                  </p>
                </div>
              </div>
            )}
          </section>

          {errors.length > 0 && (
            <div className="error-list" role="alert">
              <strong>Revise os dados:</strong>
              <ul>
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="order-summary checkout-summary">
          <h2>Resumo do pedido</h2>
          <ul className="checkout-items">
            {items.map((item) => (
              <li key={item.id}>
                <span>
                  {item.quantity}x {item.title}
                </span>
                <b>{formatBRL(item.price * item.quantity)}</b>
              </li>
            ))}
          </ul>
          <dl>
            <div>
              <dt>Impostos</dt>
              <dd>{formatBRL(taxes.total)}</dd>
            </div>
            <div>
              <dt>
                {draft.shipping.label} - {draft.shipping.carrier}
              </dt>
              <dd>
                {draft.shipping.price === 0
                  ? "Grátis"
                  : formatBRL(draft.shipping.price)}
              </dd>
            </div>
            <div className="summary-total">
              <dt>Total</dt>
              <dd>{formatBRL(total)}</dd>
            </div>
          </dl>
          <button
            type="submit"
            className="btn full-button"
            disabled={processing}
          >
            {processing
              ? "Processando..."
              : method === "pix"
                ? "Gerar PIX e pedido"
                : "Confirmar pagamento"}
          </button>
          <p className="summary-note">
            Operação demonstrativa: nenhuma cobrança ou e-mail real será enviado.
          </p>
        </aside>
      </form>
    </main>
  );
}
