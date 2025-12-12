import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product, CartItem } from '../models/product.model'; // Importe CartItem

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // Agora guardamos CartItem!
  private items: CartItem[] = [];
  private cartCount = new BehaviorSubject<number>(0);

  constructor() { }

  addToCart(product: Product) {
    // Verifica se já tem esse produto no carrinho
    const existingItem = this.items.find(i => i.product.id === product.id);

    if (existingItem) {
      // Se já tem, só aumenta a quantidade
      existingItem.quantity++;
    } else {
      // Se não tem, adiciona novo com quantidade 1
      this.items.push({ product: product, quantity: 1 });
    }

    // Atualiza o contador (soma das quantidades ou número de itens únicos?
    // Shopee costuma mostrar número de itens únicos, mas vamos somar tudo para dar sensação de volume)
    this.updateCount();
    console.log('Carrinho atual:', this.items);
  }

  // Método auxiliar para atualizar o contador total
  private updateCount() {
    const totalCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.cartCount.next(totalCount);
  }

  getCount() {
    return this.cartCount.asObservable();
  }

  getItems() {
    return this.items;
  }

  clearCart() {
    this.items = [];
    this.cartCount.next(0);
  }
}
