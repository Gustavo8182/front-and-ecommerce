import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/orders';

  constructor(private http: HttpClient) { }

// Recebe a lista completa de CartItems
  createOrder(cartItems: CartItem[]): Observable<any> {
    // Transforma [{product:..., quantity: 2}] em [{productId: "...", quantity: 2}]
    const itemsPayload = cartItems.map(item => ({
      productId: item.product.id,
      quantity: item.quantity
    }));

    const payload = { items: itemsPayload };
    return this.http.post(this.apiUrl, payload);
  }

  getMyOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
