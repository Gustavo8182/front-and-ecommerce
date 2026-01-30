import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ShippingOption, ShippingCalculationRequest } from '../models/shipping.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShippingService {
  private apiUrl = `${environment.apiBaseUrl}/shipping`;

  constructor(private http: HttpClient) {}

  calculate(request: ShippingCalculationRequest): Observable<ShippingOption[]> {
    return this.http.post<ShippingOption[]>(`${this.apiUrl}/calculate`, request);
  }
}
