import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StoreService } from '../../services/store.service';
import { Store } from '../../models/store.model';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-seller-center',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './seller-center.component.html',
  styleUrl: './seller-center.component.scss'
})
export class SellerCenterComponent implements OnInit {

  store: Store | null = null; // Se null = Não tem loja. Se preenchido = Tem loja.
  isLoading = true;
  isCreating = false; // Loading do botão de criar
  formStore: FormGroup;

  constructor(
    private storeService: StoreService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.formStore = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.maxLength(500)]],
      cnpj: [''] // Opcional por enquanto
    });
  }

  ngOnInit(): void {
    this.checkHasStore();
  }

  checkHasStore() {
    this.isLoading = true;
    this.storeService.getMyStore().subscribe({
      next: (data) => {
        // Se a API retornar dados (200 OK), o usuário tem loja
        if (data) {
          this.store = data;
        }
        this.isLoading = false;
      },
      error: (err) => {
        // Se der 404 ou 204, assumimos que não tem loja
        console.log('Usuário ainda não possui loja ou erro:', err);
        this.store = null;
        this.isLoading = false;
      }
    });
  }

  onSubmitSetup() {
    if (this.formStore.invalid) return;

    this.isCreating = true;
    this.storeService.createStore(this.formStore.value).subscribe({
      next: () => {
        alert('Parabéns! Sua loja foi criada com sucesso.');
        this.checkHasStore(); // Recarrega para mostrar o Dashboard
        this.isCreating = false;
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao criar loja. Tente outro nome.');
        this.isCreating = false;
      }
    });
  }
}
