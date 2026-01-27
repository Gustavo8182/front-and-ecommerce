import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Page } from '../models/page.model';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  // URL Base: http://localhost:8080 (ou produção)
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  // Auxiliar para Headers (Token)
  private getHeaders() {
    const token = localStorage.getItem('auth-token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // ==========================================
  //  COMPRADOR (Cliente)
  // ==========================================

  createOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/orders`, orderData, { headers: this.getHeaders() });
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/orders`, { headers: this.getHeaders() });
  }

  payOrder(orderId: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/orders/${orderId}/pay`, {}, { headers: this.getHeaders() });
  }

  // ==========================================
  //  VENDEDOR (Painel de Vendas)
  // ==========================================

  // 1. Listar Vendas (Substitui o antigo getStoreOrders)
  getMySales(page: number = 0, size: number = 10): Observable<Page<Order>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    // Chama o endpoint unificado: GET /orders/sales
    return this.http.get<Page<Order>>(`${this.baseUrl}/orders/sales`, {
      headers: this.getHeaders(),
      params: params
    });
  }

  // 2. Atualizar Status do Pedido
  updateStatus(orderId: string, newStatus: string): Observable<Order> {
    // Chama: PATCH /orders/{id}/status
    return this.http.patch<Order>(
      `${this.baseUrl}/orders/${orderId}/status`,
      { status: newStatus },
      { headers: this.getHeaders() }
    );
  }

  // --- ADMIN (Correção do Erro TS2339) ---
  // Re-adicionamos este método para o AdminOrdersComponent não quebrar
  getAllOrders(): Observable<Order[]> {
    // Nota: Você precisará criar esse endpoint no Backend se quiser usar o painel de Admin
    return this.http.get<Order[]>(`${this.baseUrl}/orders/admin/all`, { headers: this.getHeaders() });
  }
}
