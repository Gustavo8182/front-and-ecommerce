import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // URL do seu Back-End Java
  private apiUrl = 'http://localhost:8080/products';

  constructor(private http: HttpClient) { }

  getProducts(page: number = 0, size: number = 10, search: string = ''): Observable<ProductResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'id,asc');

    // Se tiver texto na busca, adiciona o parâmetro na URL
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<ProductResponse>(this.apiUrl, { params });
  }
}
