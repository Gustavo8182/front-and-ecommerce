import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${environment.apiBaseUrl}/products`;

  constructor(private http: HttpClient) { }


  createProduct(product: any): Observable<any> {
    return this.http.post(this.apiUrl, product);
  }

getProducts(page: number = 0, size: number = 10, search: string = ''): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'id,asc');

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateProduct(id: string, product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
