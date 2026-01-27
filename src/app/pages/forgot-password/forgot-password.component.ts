import { environment } from './../../../environments/environment';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  step = 1;
  email = '';
  code = '';
  newPassword = '';
  isLoading = false;
  private apiUrl = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  requestRecovery() {
    if (!this.email) return;
    this.isLoading = true;

    this.http.post(`${this.apiUrl}/forgot-password`, { email: this.email }).subscribe({
      next: () => {
        this.step = 2; // Avança para a tela de código
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        // Avança mesmo com erro para não revelar se email existe (segurança)
        this.step = 2;
      }
    });
  }

  resetPassword() {
    if (!this.code || !this.newPassword) return;
    this.isLoading = true;

    const payload = {
      email: this.email,
      code: this.code,
      newPassword: this.newPassword
    };

    this.http.post(`${this.apiUrl}/reset-password`, payload).subscribe({
      next: () => {
        alert('Senha alterada com sucesso! Faça login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        alert('Erro: Código inválido ou expirado.');
        this.isLoading = false;
      }
    });
  }
}
