import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ProductResponse } from '../models/product.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${environment.apiBaseUrl}/products`;

  constructor(private http: HttpClient) { }

  // --- LEITURA (Público) ---

  getProducts(page: number = 0, size: number = 10, search: string = ''): Observable<ProductResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'id,asc'); // ou 'name,asc' se preferir

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<ProductResponse>(this.apiUrl, { params });
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // --- ESCRITA (Admin - Requer Token) ---

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
