import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {

  form: FormGroup;
  isEditMode = false;
  productId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Configura o formulário com as validações
    this.form = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.required],
      quantityStock: [0, [Validators.required, Validators.min(0)]],
      imageUrl: [''] // Opcional
    });
  }

  ngOnInit(): void {
    // Verifica se tem ID na rota (Modo Edição)
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode = true;
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: string) {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.form.patchValue(product); // Preenche o formulário
      },
      error: () => {
        alert('Erro ao carregar produto.');
        this.router.navigate(['/admin/products']);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const productData = this.form.value;

    if (this.isEditMode && this.productId) {
      // ATUALIZAR
      this.productService.updateProduct(this.productId, productData).subscribe({
        next: () => {
          alert('Produto atualizado!');
          this.router.navigate(['/admin/products']);
        },
        error: () => alert('Erro ao atualizar.')
      });
    } else {
      // CRIAR
      this.productService.createProduct(productData).subscribe({
        next: () => {
          alert('Produto criado com sucesso!');
          this.router.navigate(['/admin/products']);
        },
        error: () => alert('Erro ao criar.')
      });
    }
  }
}
