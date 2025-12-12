import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product, CartItem } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private items: CartItem[] = [];
  private cartCount = new BehaviorSubject<number>(0);
  private storageKey = 'my-shop-cart'; // Chave para salvar no navegador

  constructor() {
    // 1. Ao iniciar o serviço, tenta recuperar o carrinho salvo
    this.loadCartFromStorage();
  }

  addToCart(product: Product) {
    const existingItem = this.items.find(i => i.product.id === product.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.items.push({ product: product, quantity: 1 });
    }

    this.updateCount();
    this.saveCartToStorage(); // <--- Salva após alterar
  }

  decreaseQuantity(productId: string) {
    const item = this.items.find(i => i.product.id === productId);
    if (item) {
      item.quantity--;
      if (item.quantity <= 0) {
        this.removeItem(productId);
      } else {
        this.updateCount();
        this.saveCartToStorage(); // <--- Salva após alterar
      }
    }
  }

  removeItem(productId: string) {
    this.items = this.items.filter(item => item.product.id !== productId);
    this.updateCount();
    this.saveCartToStorage(); // <--- Salva após alterar
  }

  clearCart() {
    this.items = [];
    this.updateCount();
    this.saveCartToStorage(); // <--- Salva (limpa) o storage
  }

  getItems() {
    return this.items;
  }

  getTotal(): number {
    return this.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }

  getCount() {
    return this.cartCount.asObservable();
  }

  private updateCount() {
    const totalCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.cartCount.next(totalCount);
  }

  // --- NOVOS MÉTODOS DE PERSISTÊNCIA ---

  // Salva o array atual no LocalStorage do navegador
  private saveCartToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }

  // Recupera do LocalStorage e preenche a memória
  private loadCartFromStorage() {
    const storedCart = localStorage.getItem(this.storageKey);
    if (storedCart) {
      try {
        this.items = JSON.parse(storedCart);
        this.updateCount(); // Atualiza a bolinha vermelha
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        this.items = [];
      }
    }
  }
}
