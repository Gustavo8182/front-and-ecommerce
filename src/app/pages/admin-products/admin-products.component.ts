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

  // 1. Pega a imagem principal (ou a primeira, ou uma padrão)
  getMainImage(product: any): string {
    if (product.images && product.images.length > 0) {
      const mainImg = product.images.find((i: any) => i.main);
      return mainImg ? mainImg.imageUrl : product.images[0].imageUrl;
    }
    return 'assets/img/sem-foto.jpg';
  }

  // 2. Calcula o menor preço entre as variações para exibir "A partir de..."
  getMinPrice(product: any): number {
    if (product.variations && product.variations.length > 0) {
      const prices = product.variations.map((v: any) => v.price);
      return Math.min(...prices);
    }
    return 0;
  }

  // 3. Soma o estoque total de todas as variações
  getTotalStock(product: any): number {
    if (product.variations && product.variations.length > 0) {
      return product.variations.reduce((acc: number, curr: any) => acc + curr.quantityStock, 0);
    }
    return 0;
  }
}
