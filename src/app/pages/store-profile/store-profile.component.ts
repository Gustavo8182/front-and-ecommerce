import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StoreService } from '../../services/store.service';
import { ProductService } from '../../services/product.service';
import { Store } from '../../models/store.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-store-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './store-profile.component.html',
  styleUrl: './store-profile.component.scss'
})
export class StoreProfileComponent implements OnInit {
  store: Store | null = null;
  products: Product[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const storeId = this.route.snapshot.paramMap.get('id');

    if (storeId) {
      this.loadStoreData(storeId);
      this.loadStoreProducts(storeId);
    }
  }

  loadStoreData(id: string) {
    // Precisamos criar esse método getPublicById no StoreService
    this.storeService.getById(id).subscribe({
      next: (data) => this.store = data,
      error: () => this.isLoading = false
    });
  }

  loadStoreProducts(id: string) {
    // Chama a busca filtrando pelo ID da loja
    this.productService.search('', 0, 20, id).subscribe({
      next: (page) => {
        this.products = page.content;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
}
