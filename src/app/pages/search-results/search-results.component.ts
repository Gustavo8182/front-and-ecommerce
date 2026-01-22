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
  query: string = '';
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // Escuta mudanças na URL (ex: se pesquisar outra coisa sem sair da página)
    this.route.queryParams.subscribe(params => {
      this.query = params['q'] || '';
      this.performSearch();
    });
  }

  performSearch(): void {
    this.isLoading = true;
    this.productService.search(this.query).subscribe({
      next: (page) => {
        this.products = page.content;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro na busca', err);
        this.isLoading = false;
      }
    });
  }
}
