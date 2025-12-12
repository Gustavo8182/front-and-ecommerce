import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];

  // Variáveis de controle da paginação
  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 10; // Deve bater com o padrão do Back-End
  searchTerm: string = ''; //  Variável da busca

constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts(this.currentPage);
  }

 onSearch() {
    if (!this.searchTerm) return;

    // Cria a URL da nova rota
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/search'], { queryParams: { q: this.searchTerm } })
    );

    // Abre em nova aba ('_blank')
    window.open(url, '_blank');
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    alert(`Produto "${product.name}" adicionado ao carrinho!`);
  }

  // Agora o método aceita o número da página
  loadProducts(page: number) {
    this.productService.getProducts(page, this.pageSize).subscribe({ // Precisaremos ajustar o Service também!
      next: (response) => {
        this.products = response.content;
        this.currentPage = response.number;
        this.totalPages = response.totalPages;
        console.log('Página carregada:', this.currentPage);
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
      }
    });
  }

  // Método chamado pelos botões do HTML
  changePage(page: number) {
    // Evita chamar página negativa ou maior que o total
    if (page >= 0 && page < this.totalPages) {
      this.loadProducts(page);
    }
  }

  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Mata o recarregamento
      this.onSearch();        // Chama a busca
    }
  }
}
