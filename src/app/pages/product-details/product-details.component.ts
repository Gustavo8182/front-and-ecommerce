import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product, ProductVariation } from '../../models/product.model';
import { Review } from '../../models/review.model';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {

  product: Product | null = null;
  selectedVariation: ProductVariation | null = null;
  currentImage: string = '';
  isLoading = true;
  reviews: Review[] = []; // Nova lista
  averageRating = 0; // Média para mostrar no topo

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getById(id).subscribe({
        // CORREÇÃO 1: Tipagem explícita (data: Product)
        next: (data: Product) => {
          this.product = data;

          // CORREÇÃO 2: Verificação de segurança (?.)
          if (this.product?.variations && this.product.variations.length > 0) {
            this.selectVariation(this.product.variations[0]);
          } else {
            this.currentImage = this.getMainImage(data);
          }

          this.isLoading = false;
          // CARREGAR REVIEWS AQUI 👇
          this.loadReviews(data.id);
        },
        // CORREÇÃO 3: Tipagem do erro (err: any)
        error: (err: any) => {
          console.error(err);
          this.isLoading = false;
        }
      });
    }
  }

  selectVariation(variation: ProductVariation) {
    this.selectedVariation = variation;

    if (variation.imageUrl) {
      this.currentImage = variation.imageUrl;
    } else {
      // CORREÇÃO 4: Garante que product existe antes de chamar
      if (this.product) {
        this.currentImage = this.getMainImage(this.product);
      }
    }
  }

  addToCart() {
    if (this.product && this.selectedVariation) {
      this.cartService.addToCart(this.product, this.selectedVariation);
      alert('Produto adicionado ao carrinho!');
    } else {
      alert('Por favor, selecione uma variação.');
    }
  }

  private getMainImage(product: Product): string {
    // CORREÇÃO 5: Verifica se imagens existem e têm tamanho > 0
    if (product.images && product.images.length > 0) {
      const main = product.images.find(i => i.main);
      // Se achou principal usa, senão usa a primeira, senão placeholder
      return main ? main.imageUrl : (product.images[0]?.imageUrl || 'assets/placeholder.png');
    }
    return 'assets/placeholder.png';
  }

  loadReviews(productId: string) {
    this.reviewService.getProductReviews(productId).subscribe(data => {
      this.reviews = data;
      // Calcular média simples
      if (data.length > 0) {
        const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
        this.averageRating = sum / data.length;
      }
    });
  }

}
