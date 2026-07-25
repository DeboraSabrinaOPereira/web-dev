"use client";

import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import {
  NavigationProvider,
  useNavigation,
} from "./contexts/NavigationContext";
import { StoreProvider } from "./contexts/StoreContext";
import Cart from "./screens/Cart";
import Checkout from "./screens/Checkout";
import Home from "./screens/Home";
import Login from "./screens/Login";
import MyAccount from "./screens/MyAccount";
import OrderConfirmed from "./screens/OrderConfirmed";
import ProductDetail from "./screens/ProductDetail";
import Admin from "./screens/admin/Admin";

function RouteView({ search }: { search: string }) {
  const { path } = useNavigation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [path]);

  if (path.startsWith("/produto/")) {
    return <ProductDetail productId={decodeURIComponent(path.slice(9))} />;
  }
  if (path.startsWith("/pedido/")) {
    return <OrderConfirmed orderId={decodeURIComponent(path.slice(8))} />;
  }
  if (path === "/carrinho") return <Cart />;
  if (path === "/checkout") return <Checkout />;
  if (path === "/login") return <Login />;
  if (path === "/conta") return <MyAccount />;
  if (path === "/admin") return <Admin />;
  return <Home search={search} />;
}

function Storefront() {
  const [search, setSearch] = useState("");

  return (
    <div className="app-shell">
      <Header search={search} onSearch={setSearch} />
      <RouteView search={search} />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <NavigationProvider>
      <AuthProvider>
        <StoreProvider>
          <CartProvider>
            <Storefront />
          </CartProvider>
        </StoreProvider>
      </AuthProvider>
    </NavigationProvider>
  );
}
