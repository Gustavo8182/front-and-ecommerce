import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { RegisterRequest } from '../../models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  // <--- 2. Atualize o objeto para ter todos os campos obrigatórios
  registerData: RegisterRequest = {
    fullName: '',
    cpf: '',
    birthDate: '',
    phone: '',
    login: '',
    password: '',
    role: 'USER'
  };

  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    // Validação simples antes de enviar (opcional, mas recomendada)
    if (!this.registerData.fullName || !this.registerData.cpf) {
      alert('Preencha todos os dados!');
      return;
    }

    this.isLoading = true;
    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.isLoading = false;
        alert('Conta criada com sucesso! Faça login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erro no cadastro', err);
        alert('Erro ao criar conta. Verifique os dados.');
      }
    });
  }
}
