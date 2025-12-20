import { Product, ProductVariation } from './product.model';

export interface CartItem {
  product: Product;
  variation: ProductVariation;
  quantity: number;
}
