import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product, CartItem, ProductVariation } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private items: CartItem[] = [];
  private cartCount = new BehaviorSubject<number>(0);
  private storageKey = 'my-shop-cart';

  constructor() {
    this.loadCartFromStorage();
  }

  // MUDANÇA CRÍTICA: Agora precisamos saber QUAL variação foi comprada
  addToCart(product: Product, variation: ProductVariation) {
    // Procura se já existe essa VARIAÇÃO específica no carrinho
    const existingItem = this.items.find(i => i.variation.id === variation.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.items.push({
        product: product,
        variation: variation, // Salvamos a variação escolhida
        quantity: 1
      });
    }

    this.updateCount();
    this.saveCartToStorage();
  }

  // MUDANÇA: Diminuir quantidade baseado no ID da VARIAÇÃO
  decreaseQuantity(variationId: string) {
    const item = this.items.find(i => i.variation.id === variationId);
    if (item) {
      item.quantity--;
      if (item.quantity <= 0) {
        this.removeItem(variationId);
      } else {
        this.updateCount();
        this.saveCartToStorage();
      }
    }
  }

  // MUDANÇA: Remover baseado no ID da VARIAÇÃO
  removeItem(variationId: string) {
    this.items = this.items.filter(item => item.variation.id !== variationId);
    this.updateCount();
    this.saveCartToStorage();
  }

  clearCart() {
    this.items = [];
    this.updateCount();
    this.saveCartToStorage();
  }

  getItems() {
    return this.items;
  }

  // MUDANÇA: O Preço agora vem da variação
  getTotal(): number {
    return this.items.reduce((acc, item) => acc + (item.variation.price * item.quantity), 0);
  }

  getCount() {
    return this.cartCount.asObservable();
  }

  private updateCount() {
    const totalCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.cartCount.next(totalCount);
  }

  private saveCartToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }

  private loadCartFromStorage() {
    const storedCart = localStorage.getItem(this.storageKey);
    if (storedCart) {
      try {
        this.items = JSON.parse(storedCart);
        this.updateCount();
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        this.items = [];
      }
    }
  }
}
