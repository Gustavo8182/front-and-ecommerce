import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importante para formulários
import { AuthService } from '../../services/auth.service';
import { Router,RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginData = {
    login: '',
    password: ''
  };
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

onSubmit() {
    this.isLoading = true;
    this.authService.login(this.loginData).subscribe({
      next: (data: any) => {
        this.isLoading = false;

        // 1. TRUQUE: Se vier como texto, converte para Objeto
        let resposta = data;
        if (typeof data === 'string') {
            console.log("⚠️ A resposta veio como texto! Convertendo...");
            resposta = JSON.parse(data);
        }

        // 2. Agora verificamos na variável 'resposta' (que com certeza é objeto)
        if (resposta && resposta.token) {
            localStorage.setItem('auth-token', resposta.token);
            this.router.navigate(['/']);
        } else {
            console.error("❌ ERRO: Token não encontrado no objeto:", resposta);
            alert("Erro no Login: Token inválido.");
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erro no login', err);
        alert('Email ou senha inválidos!');
      }
    });
  }
}
