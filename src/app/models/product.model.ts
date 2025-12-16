


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
  variation: ProductVariation; // <--- NOVO CAMPO OBRIGATÓRIO
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

export interface Category {
  id: string;
  name: string;
  parent?: Category; // O '?' indica opcional
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  main: boolean;
}

export interface ProductVariation {
  id: string;
  name: string;
  price: number;
  quantityStock: number;
  sku: string;
  gtin: string;
  imageUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  videoUrl?: string;

  // Objetos aninhados
  category: Category;
  images: ProductImage[];
  variations: ProductVariation[];

  // Informações Fiscais/Envio
  ncm?: string;
  weightKg?: number;
  widthCm?: number;
  heightCm?: number;
  depthCm?: number;

  active: boolean;
  creationDate: string;

  // Links HATEOAS (opcional no front, mas bom ter mapeado)
  _links?: {
    self: { href: string };
  };
}
