import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss'
})
export class AdminProductsComponent implements OnInit {

  products: Product[] = [];

  // Paginação simples (para o MVP carregaremos a primeira página grande)
  page = 0;
  size = 50;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts(this.page, this.size).subscribe({
      next: (data) => {
        this.products = data.content;
      },
      error: (err) => console.error('Erro ao carregar produtos', err)
    });
  }

  deleteProduct(product: Product) {
    if(confirm(`Tem certeza que deseja excluir "${product.name}"?`)) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          alert('Produto excluído com sucesso!');
          this.loadProducts(); // Recarrega a lista
        },
        error: () => alert('Erro ao excluir. Verifique se existem pedidos vinculados a este produto.')
      });
    }
  }
}
