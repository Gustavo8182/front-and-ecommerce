import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // RouterModule para o link "Já tem conta"
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  registerData = {
    login: '',
    password: '',
    role: 'USER' // <--- Forçamos o papel de CLIENTE aqui
  };
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.isLoading = false;
        alert('Conta criada com sucesso! Faça login.');
        this.router.navigate(['/login']); // Manda para o login após cadastrar
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erro no cadastro', err);
        alert('Erro ao criar conta. Verifique se o email já existe.');
      }
    });
  }
}
