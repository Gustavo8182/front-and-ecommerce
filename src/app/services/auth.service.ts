import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { RegisterRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/auth`;

  // Guarda o NOME/EMAIL do usuário
  private username = new BehaviorSubject<string>("");

  constructor(private http: HttpClient) {
    this.decodeToken();
  }

  private decodeToken() {
    const token = localStorage.getItem('auth-token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.username.next(decoded.sub || "");
      } catch (error) {
        console.error("Erro ao decodificar token", error);
        this.logout();
      }
    } else {
      this.username.next("");
    }
  }

  getUsername(): Observable<string> {
    return this.username.asObservable();
  }

  // --- CORREÇÃO PRINCIPAL AQUI ---
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response: any) => {
          if (response && response.token) {
            localStorage.setItem('auth-token', response.token);
            this.decodeToken(); // Atualiza o estado do usuário
          }
        })
      );
  }

  isLoggedIn(): Observable<boolean> {
    return this.username.asObservable().pipe(
      map(user => !!user)
    );
  }

  logout() {
    localStorage.removeItem('auth-token');
    this.username.next("");
  }

  register(userData: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, userData);
  }
}
