import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Address } from '../models/address.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = `${environment.apiBaseUrl}/addresses`;

  constructor(private http: HttpClient) { }

  // Criar novo endereço
  createAddress(address: Address): Observable<Address> {
    return this.http.post<Address>(this.apiUrl, address);
  }

  // Listar meus endereços
  getMyAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(this.apiUrl);
  }

  // Deletar endereço
  deleteAddress(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
