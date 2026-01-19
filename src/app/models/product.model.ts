import { Category } from "./category.model";

export interface ProductImage {
  id: string;
  imageUrl: string;
  main: boolean;
}

export interface ProductVariation {
  id: string;
  name: string;          // Ex: "Azul - M"
  price: number;
  quantityStock: number;
  sku?: string;
  gtin?: string;
  imageUrl?: string;     // Foto específica da variação
}

export interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  videoUrl?: string;
  active: boolean;

  // O Backend envia objetos resumidos (DTOs), não apenas IDs
  category: { id: string; name: string };
  store: { id: string; name: string };

  // Listas
  images: ProductImage[];
  variations: ProductVariation[];

  // --- Dados Fiscais (NFe) ---
  ncm?: string;
  origin?: string;
  csosn?: string;
  unit?: string;
  cest?: string;
  cfopState?: string;
  cfopInterstate?: string;

  // --- Dados de Envio ---
  weightKg?: number;
  widthCm?: number;
  heightCm?: number;
  depthCm?: number;
}
