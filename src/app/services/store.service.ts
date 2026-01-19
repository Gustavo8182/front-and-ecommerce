import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { CreateStoreRequest, Store } from '../models/store.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  // Ajuste a porta se necessário
   private apiUrl = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('auth-token'); // Or wherever you store it
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Cria a loja vinculada ao usuário logado
  createStore(dados: CreateStoreRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/stores`, dados);
  }

  // Verifica se o usuário já tem loja
  getMyStore(): Observable<Store> {
    return this.http.get<Store>(`${this.apiUrl}/stores/my-store`, { headers: this.getHeaders() });
  }

  // Método auxiliar para o Navbar saber se mostra o botão
  checkIfHasStore(): Observable<boolean> {
    return this.http.get<Store>(`${this.apiUrl}/stores/my-store`).pipe(
      map(store => !!store), // Transforma o objeto em true (se existir) ou false
      catchError(() => of(false)) // Se der erro (404/403), retorna false
    );
  }

  getMyStoreProducts(page: number = 0, size: number = 10): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/stores/my-store/products?page=${page}&size=${size}`, { headers: this.getHeaders() });
  }
}
