import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CartService } from './services/cart.service';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { OrderService } from './services/order.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
 cartCount: number = 0;
  loggedUser: string = "";

  constructor(
    private cartService: CartService,
    private authService: AuthService
    // OrderService removido
  ) {}

  ngOnInit(): void {
    // Ouve as mudanças no contador do carrinho
    this.cartService.getCount().subscribe(count => this.cartCount = count);

    // Ouve as mudanças no nome do usuário
    this.authService.getUsername().subscribe(name => {
      this.loggedUser = name;
    });
  }

  logout() {
    this.authService.logout();
  }
}
