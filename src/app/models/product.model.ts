export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantityStock: number;
  imageUrl: string;
}

// O Spring retorna um objeto "Page", então precisamos mapear essa resposta
export interface ProductResponse {
  content: Product[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // número da página atual
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id?: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}
