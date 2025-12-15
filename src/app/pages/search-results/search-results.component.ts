import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent implements OnInit {

  products: Product[] = [];
  searchTerm: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
    // private cartService: CartService <--- REMOVIDO: Não adicionamos ao carrinho daqui
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['q'] || '';
      this.doSearch(this.searchTerm);
    });
  }

  doSearch(query: string) {
    this.productService.getProducts(0, 50, query).subscribe({
      next: (res) => {
        this.products = res.content;
      },
      error: (err) => console.error(err)
    });
  }

  // --- MÉTODOS DE VISUALIZAÇÃO ---

  // 1. Pega a imagem principal
  getMainImage(product: any): string {
    if (product.images && product.images.length > 0) {
      const mainImg = product.images.find((i: any) => i.main);
      return mainImg ? mainImg.imageUrl : product.images[0].imageUrl;
    }
    return '';
  }

  // 2. Pega o menor preço para exibir "A partir de R$..."
  getDisplayPrice(product: any): number {
    if (product.variations && product.variations.length > 0) {
      const prices = product.variations.map((v: any) => v.price);
      return Math.min(...prices);
    }
    return 0;
  }
}
