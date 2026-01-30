import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Review, ReviewRequest } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiBaseUrl}/reviews`;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('auth-token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  // Criar avaliação (Precisa de token)
  createReview(review: ReviewRequest): Observable<any> {
    return this.http.post(this.apiUrl, review, { headers: this.getHeaders() });
  }

  // Ler avaliações (Público)
  getProductReviews(productId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/product/${productId}`);
  }
}
