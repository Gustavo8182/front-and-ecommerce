import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
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

// --- MÉTODOS VISUAIS ---


  // 1. Pega a Imagem de Capa (Main) ou a primeira que encontrar
  getMainImage(product: Product): string {
    if (!product.images || product.images.length === 0) {
      return 'assets/img/sem-foto.jpg'; // Crie uma imagem padrão para fallback
    }

    // Tenta achar a marcada como main: true
    const mainImg = product.images.find(img => img.main);

    // Se achar retorna ela, senão retorna a primeira da lista
    return mainImg ? mainImg.imageUrl : product.images[0].imageUrl;
  }

  // 2. Pega o "Menor Preço" entre as variações para exibir "A partir de..."
  getDisplayPrice(product: Product): number {
    if (!product.variations || product.variations.length === 0) {
      return 0;
    }

    // Matemática simples para achar o menor valor no array de variações
    const prices = product.variations.map(v => v.price);
    return Math.min(...prices);
  }

}
