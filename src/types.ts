export type ProductType = "fisico" | "ebook" | "kit";
export type ProductStatus = "ativo" | "inativo";
export type UserRole = "cliente" | "admin" | "editor" | "vendedor";
export type OrderStatus =
  | "Pendente"
  | "Pago"
  | "Em separação"
  | "Enviado"
  | "Entregue"
  | "Cancelado";

export interface Product {
  id: string;
  title: string;
  author: string;
  type: ProductType;
  price: number;
  stock: number | null;
  category: string;
  tags: string[];
  image: string;
  description: string;
  status: ProductStatus;
  downloadFile?: string;
}

export interface CartItem {
  id: string;
  title: string;
  type: ProductType;
  price: number;
  quantity: number;
  image: string;
  downloadFile?: string;
}

export interface UserAccount {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface ShippingOption {
  id: string;
  label: string;
  carrier: string;
  price: number;
  days: number;
  kind: "delivery" | "pickup" | "digital";
}

export interface Address {
  cep: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
}

export interface Taxes {
  physical: number;
  digital: number;
  total: number;
}

export interface Payment {
  method: "cartao" | "pix";
  gateway: "mock";
  brand?: string;
  last4?: string;
  pixKey?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
  };
  items: CartItem[];
  subtotal: number;
  taxes: Taxes;
  shipping: ShippingOption;
  address: Address | null;
  total: number;
  payment: Payment;
  status: OrderStatus;
}

export interface EmailRecord {
  id: string;
  createdAt: string;
  to: string;
  subject: string;
  body: string;
  status: "simulado";
}

export interface ActivityLog {
  id: string;
  createdAt: string;
  actor: string;
  action: string;
}

export interface CheckoutDraft {
  shipping: ShippingOption;
  cep: string;
}
