import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StoreService } from '../../services/store.service';
import { Store } from '../../models/store.model';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';


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
  myProducts: any[] = [];
  totalProducts = 0;

  constructor(
    private storeService: StoreService,
    private fb: FormBuilder,
    private router: Router,
    private productService: ProductService
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

  // Atualize o checkHasStore para carregar produtos se a loja existir
  checkHasStore() {
  this.isLoading = true;
  this.storeService.getMyStore().subscribe({
    next: (data) => {
      if (data) {
        this.store = data;
        this.loadMyProducts(); // <--- CARREGA OS PRODUTOS
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

  loadMyProducts() {
    // Certifique-se que o ProductService tem o método getMyStoreProducts()
    this.productService.getMyStoreProducts().subscribe({
      next: (pageData) => {
        this.myProducts = pageData.content;
        this.totalProducts = pageData.totalElements;
      },
      error: (err) => console.error('Erro ao listar produtos', err)
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
