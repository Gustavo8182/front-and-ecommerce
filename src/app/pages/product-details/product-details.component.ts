import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product, ProductVariation } from '../../models/product.model'; // Importe ProductVariation

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {

  product: Product | null = null;
  selectedVariation: ProductVariation | null = null; // Guarda a escolha do usuário
  currentImage: string = ''; // Guarda a imagem que está aparecendo na tela grande
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.productService.getProductById(id).subscribe({
        next: (data) => {
          this.product = data;
          this.isLoading = false;

          // LOGICA DE AUTO-SELEÇÃO:
          // Se tiver imagens, define a principal como capa inicial
          if (this.product.images && this.product.images.length > 0) {
            const mainImg = this.product.images.find(i => i.main);
            this.currentImage = mainImg ? mainImg.imageUrl : this.product.images[0].imageUrl;
          }

          // Se tiver variações, seleciona a primeira automaticamente
          if (this.product.variations && this.product.variations.length > 0) {
            this.selectVariation(this.product.variations[0]);
          }
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });
    }
  }

  // Método chamado quando o usuário clica num botão de variação
  selectVariation(variation: ProductVariation) {
    this.selectedVariation = variation;

    // Se a variação tem foto específica (ex: celular azul), troca a imagem principal
    if (variation.imageUrl) {
      this.currentImage = variation.imageUrl;
    }
  }

  // Método para trocar imagem ao clicar nas miniaturas (Thumbnails)
  changeImage(url: string) {
    this.currentImage = url;
  }

  addToCart() {
    if (this.product && this.selectedVariation) {
      // CORREÇÃO DO ERRO: Passamos o Produto E a Variação
      this.cartService.addToCart(this.product, this.selectedVariation);
      alert(`Produto "${this.product.name}" (${this.selectedVariation.name}) adicionado!`);
    } else {
      alert('Por favor, selecione uma opção.');
    }
  }
}
