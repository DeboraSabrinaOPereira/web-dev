import {
  FaBook,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTruck,
} from "react-icons/fa";
import { AppLink } from "../contexts/NavigationContext";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid shell">
        <section>
          <h2>
            <FaBook aria-hidden="true" /> COMPIA
          </h2>
          <p>
            Editora de conteúdos técnicos em Inteligência Artificial,
            Blockchain, Criptografia e Cibersegurança.
          </p>
        </section>
        <section>
          <h2>Links rápidos</h2>
          <AppLink to="/">Catálogo</AppLink>
          <AppLink to="/carrinho">Carrinho</AppLink>
          <AppLink to="/conta">Área do cliente</AppLink>
        </section>
        <section>
          <h2>
            <FaTruck aria-hidden="true" /> Entregas
          </h2>
          <p>Correios, transportadora parceira, retirada local e entrega digital.</p>
        </section>
        <section>
          <h2>Contato</h2>
          <p>
            <FaMapMarkerAlt aria-hidden="true" /> Campina Grande - PB
          </p>
          <p>
            <FaEnvelope aria-hidden="true" /> contato@compia.com.br
          </p>
        </section>
      </div>
      <div className="footer-credit">
        Projeto acadêmico de front-end - pagamentos, envios e e-mails simulados.
      </div>
    </footer>
  );
}
