import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem } from '../models/product.model';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  // 1. Definimos a URL Base da API (Single Source of Truth)
  // Em projetos maiores, isso viria do environment.ts
 private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  // ==========================================
  //  MÉTODOS DO CLIENTE (Rota: /orders)
  // ==========================================

  createOrder(orderData: any): Observable<any> {
    const token = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.baseUrl}/orders`, orderData, { headers });
  }

  getMyOrders(): Observable<any[]> {
    const token = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.baseUrl}/orders`, { headers });
  }

  payOrder(orderId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/orders/${orderId}/pay`, {});
  }

  // ==========================================
  //  MÉTODOS DO ADMIN (Rota: /admin/orders)
  // ==========================================

  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/orders`);
  }

  updateStatus(orderId: string, status: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/admin/orders/${orderId}/status`, { status });
  }
}
