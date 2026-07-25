"use client";

import { useState } from "react";
import { FaSignInAlt, FaUser } from "react-icons/fa";
import {
  ACCOUNTS,
  ROLE_LABELS,
  useAuth,
} from "../contexts/AuthContext";
import { useNavigation } from "../contexts/NavigationContext";

export default function Login() {
  const { login } = useAuth();
  const { navigate } = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function fillAccount(account: (typeof ACCOUNTS)[number]) {
    setEmail(account.email);
    setPassword(account.password);
    setError("");
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      const account = login(email, password);
      navigate(account.role === "cliente" ? "/conta" : "/admin");
    } catch (loginError) {
      setError(
        loginError instanceof Error ? loginError.message : "Falha ao entrar.",
      );
    }
  }

  return (
    <main className="page shell login-page">
      <section className="login-card">
        <div className="login-heading">
          <FaUser aria-hidden="true" />
          <div>
            <h1>Entrar</h1>
            <p>Acesse seus pedidos ou o painel da editora.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <label>
            <span>E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
            />
          </label>
          <label>
            <span>Senha</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn full-button">
            <FaSignInAlt aria-hidden="true" /> Entrar
          </button>
        </form>
      </section>

      <section className="demo-accounts">
        <h2>Contas de demonstração</h2>
        <p>Escolha um perfil e clique em usar para preencher o acesso.</p>
        <div className="account-list">
          {ACCOUNTS.map((account) => (
            <article key={account.email}>
              <div>
                <strong>{ROLE_LABELS[account.role]}</strong>
                <span>{account.name}</span>
              </div>
              <code>{account.email}</code>
              <code>{account.password}</code>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => fillAccount(account)}
              >
                Usar
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
