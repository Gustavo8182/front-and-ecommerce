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
      next: (token) => {
        this.isLoading = false;
        console.log('Login Sucesso! Token:', token);
        this.router.navigate(['/']); // Manda o usuário para a Home
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erro no login', err);
        alert('Email ou senha inválidos!');
      }
    });
  }
}
