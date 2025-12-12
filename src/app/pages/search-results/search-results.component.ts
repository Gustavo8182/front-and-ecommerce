import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
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
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Lê o parâmetro 'q' da URL
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['q'] || '';
      this.doSearch(this.searchTerm);
    });
  }

  doSearch(query: string) {
    // Chama o serviço passando a busca (página 0, tamanho 50 para trazer bastante coisa)
    this.productService.getProducts(0, 50, query).subscribe({
      next: (res) => {
        this.products = res.content;
      },
      error: (err) => console.error(err)
    });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    alert(`Produto "${product.name}" adicionado!`);
  }
}
