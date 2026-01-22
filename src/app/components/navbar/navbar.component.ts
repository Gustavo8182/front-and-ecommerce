import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { StoreService } from '../../services/store.service'; // Importe o StoreService
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  cartCount: number = 0;
  loggedUser: string | null = null;
  hasStore = false;
  searchQuery: string = '';

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private storeService: StoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. Contador do Carrinho
    this.cartService.getCount().subscribe(count => this.cartCount = count);

    // 2. Dados do Usuário
    this.authService.getUsername().subscribe(name => {
      this.loggedUser = name;

      // 3. Se logou, verifica se tem loja
      if (this.loggedUser) {
        this.checkStoreStatus();
      } else {
        this.hasStore = false;
      }
    });
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      // Navega para a rota /search passando o texto como query param
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }

  checkStoreStatus() {
    this.storeService.checkIfHasStore().subscribe(status => {
      this.hasStore = status;
    });
  }

  logout() {
    this.authService.logout();
    this.hasStore = false; // Reseta status ao sair
  }
}
