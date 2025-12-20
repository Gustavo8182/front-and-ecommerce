import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { CreateStoreRequest, Store } from '../models/store.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  // Ajuste a porta se necessário
   private apiUrl = `${environment.apiBaseUrl}/stores`;

  constructor(private http: HttpClient) { }

  // Cria a loja vinculada ao usuário logado
  createStore(dados: CreateStoreRequest): Observable<void> {
    return this.http.post<void>(this.apiUrl, dados);
  }

  // Verifica se o usuário já tem loja
  getMyStore(): Observable<Store> {
    return this.http.get<Store>(`${this.apiUrl}/my-store`);
  }

  // Método auxiliar para o Navbar saber se mostra o botão
  checkIfHasStore(): Observable<boolean> {
    return this.http.get<Store>(`${this.apiUrl}/my-store`).pipe(
      map(store => !!store), // Transforma o objeto em true (se existir) ou false
      catchError(() => of(false)) // Se der erro (404/403), retorna false
    );
  }
}
