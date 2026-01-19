import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product, ProductVariation } from '../../models/product.model';

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
          
          if (data.images && data.images.length > 0) {
            const mainImg = data.images.find((i: any) => i.main);
            // Se achar a main, usa ela. Se não, usa a primeira da lista.
            this.currentImage = mainImg ? mainImg.imageUrl : data.images[0].imageUrl;
          }

          if (data.variations && data.variations.length > 0) {
            this.selectVariation(data.variations[0]);
          }
        },
        error: (err) => {
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
    }
  }

  changeImage(url: string) {
    this.currentImage = url;
  }

  addToCart() {
    if (this.product && this.selectedVariation) {
      this.cartService.addToCart(this.product, this.selectedVariation);
      alert(`Produto "${this.product.name}" (${this.selectedVariation.name}) adicionado!`);
    } else {
      alert('Por favor, selecione uma opção.');
    }
  }
}