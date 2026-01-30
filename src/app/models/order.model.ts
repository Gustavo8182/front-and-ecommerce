export interface OrderItem {
  id: string;
  productName: string;
  variationName: string;
  price: number;
  quantity: number;
  subtotal: number;
  imageUrl: string; // O Back-end já manda a URL da foto correta
}

export interface OrderAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Order {
  id: string;
  creationDate: string; // ISO String que vem do Java
  status: 'WAITING_PAYMENT' | 'PAID' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';
  total: number;
  items: OrderItem[];
  user?: {
    login: string;
    fullName?: string;
  };
  address: OrderAddress;
  trackingCode?: string; // Futuro
}

export interface OrderItem {
  id: string;
  productId: string; // Lembre que adicionamos esse também
  productName: string;
  variationName: string;
  price: number;
  quantity: number;
  subtotal: number;
  imageUrl: string;
  reviewed: boolean; // <--- NOVO
}
