import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // <--- Importe a biblioteca

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';

  // Agora guardamos o NOME do usuário, não só booleano
  private username = new BehaviorSubject<string>("");

  constructor(private http: HttpClient) {
    // Ao iniciar (F5), verifica se já tem token salvo e recupera o nome
    this.decodeToken();
  }

  // Método privado para ler o token
  private decodeToken() {
    const token = localStorage.getItem('auth-token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        // O backend salvou o email no campo "sub" (subject)
        this.username.next(decoded.sub || "");
      } catch (error) {
        console.error("Erro ao decodificar token", error);
        this.logout(); // Se o token estiver corrompido, desloga
      }
    } else {
      this.username.next("");
    }
  }

  // Quem quiser saber o nome do usuário, se inscreve aqui
  getUsername(): Observable<string> {
    return this.username.asObservable();
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, { responseType: 'text' })
      .pipe(
        tap((token) => {
          localStorage.setItem('auth-token', token);
          this.decodeToken(); // <--- Decodifica assim que loga
        })
      );
  }

  logout() {
    localStorage.removeItem('auth-token');
    this.username.next(""); // Limpa o nome
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }
}
