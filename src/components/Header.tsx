"use client";

import {
  FaBook,
  FaClipboardList,
  FaHome,
  FaSearch,
  FaShoppingCart,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { useAuth, ROLE_LABELS } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import {
  AppLink,
  useNavigation,
} from "../contexts/NavigationContext";

export default function Header({
  search,
  onSearch,
}: {
  search: string;
  onSearch: (value: string) => void;
}) {
  const { user, role, logout } = useAuth();
  const { count } = useCart();
  const { navigate, path } = useNavigation();

  const accountPath =
    role && role !== "cliente" ? "/admin" : role === "cliente" ? "/conta" : "/login";

  function handleLogout() {
    logout();
    navigate("/");
  }

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    navigate("/");
    window.setTimeout(() => {
      document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  return (
    <>
      <header className="site-header">
        <div className="header-primary shell">
          <AppLink to="/" className="brand" ariaLabel="COMPIA - início">
            <FaBook aria-hidden="true" />
            <span>COMPIA</span>
          </AppLink>

          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="search"
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Buscar livros, autores ou temas..."
              aria-label="Buscar no catálogo"
            />
            <button type="submit" aria-label="Executar busca">
              <FaSearch aria-hidden="true" />
            </button>
          </form>

          <div className="header-actions">
            <AppLink
              to="/carrinho"
              className="icon-link"
              ariaLabel={`Carrinho com ${count} item(ns)`}
            >
              <FaShoppingCart aria-hidden="true" />
              {count > 0 && <span className="cart-count">{count}</span>}
            </AppLink>
            <AppLink
              to={accountPath}
              className="icon-link"
              ariaLabel={user ? `Conta de ${user.name}` : "Entrar"}
            >
              <FaUser aria-hidden="true" />
            </AppLink>
            {user && (
              <button
                type="button"
                className="icon-link"
                onClick={handleLogout}
                aria-label="Sair"
                title="Sair"
              >
                <FaSignOutAlt aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        <div className="header-secondary">
          <nav className="desktop-nav shell" aria-label="Navegação principal">
            <AppLink to="/" className={path === "/" ? "active" : ""}>
              Catálogo
            </AppLink>
            <AppLink
              to="/carrinho"
              className={path === "/carrinho" ? "active" : ""}
            >
              Carrinho
            </AppLink>
            {role === "cliente" && (
              <AppLink
                to="/conta"
                className={path === "/conta" ? "active" : ""}
              >
                Minha conta
              </AppLink>
            )}
            {role && role !== "cliente" && (
              <AppLink
                to="/admin"
                className={path === "/admin" ? "active" : ""}
              >
                Painel administrativo
              </AppLink>
            )}
            {!user && (
              <AppLink
                to="/login"
                className={path === "/login" ? "active" : ""}
              >
                Entrar
              </AppLink>
            )}
            <span className="nav-session">
              {user
                ? `${user.name} - ${ROLE_LABELS[user.role]}`
                : "Loja virtual de demonstração"}
            </span>
          </nav>
        </div>
      </header>

      <nav className="bottom-navbar" aria-label="Navegação móvel">
        <AppLink to="/" ariaLabel="Catálogo">
          <FaHome aria-hidden="true" />
          <span>Catálogo</span>
        </AppLink>
        <AppLink to="/carrinho" ariaLabel="Carrinho">
          <FaShoppingCart aria-hidden="true" />
          <span>Carrinho</span>
          {count > 0 && <b>{count}</b>}
        </AppLink>
        <AppLink to={accountPath} ariaLabel={role === "cliente" ? "Minha conta" : "Conta"}>
          {role && role !== "cliente" ? (
            <FaClipboardList aria-hidden="true" />
          ) : (
            <FaUser aria-hidden="true" />
          )}
          <span>{role && role !== "cliente" ? "Painel" : "Conta"}</span>
        </AppLink>
      </nav>
    </>
  );
}
