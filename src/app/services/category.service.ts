import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = `${environment.apiBaseUrl}/categories`;

  constructor(private http: HttpClient) { }

  // 1. LISTAR TODAS
  // ATENÇÃO: Adicionamos o Token aqui para resolver o erro 403
  getAll(): Observable<Category[]> {
    const token = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Category[]>(this.apiUrl, { headers });
  }

  // 2. CRIAR NOVA (Admin)
  create(name: string): Observable<Category> {
    const token = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Category>(this.apiUrl, { name }, { headers });
  }
}
