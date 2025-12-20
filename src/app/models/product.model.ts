// Interfaces auxiliares (Categorias, Imagens, Variações)
export interface Category {
  id: string;
  name: string;
  parent?: Category;
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

// Entidade Principal
export interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  videoUrl?: string;

  // Relacionamentos
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

  // HATEOAS
  _links?: {
    self: { href: string };
  };
}

// Resposta Paginada da API
export interface ProductResponse {
  content: Product[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}
