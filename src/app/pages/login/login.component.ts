import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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
    if (!this.loginData.login || !this.loginData.password) return;

    this.isLoading = true;

    this.authService.login(this.loginData).subscribe({
      next: (response) => { // 'response' já é o objeto JSON
        this.isLoading = false;
        if (response && response.token) {
             console.log("Login efetuado com sucesso!");
             // Navega para a área do vendedor ou home
             this.router.navigate(['/seller-center']); 
        } else {
             console.error("Objeto de resposta inesperado:", response);
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