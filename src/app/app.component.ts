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
  loggedUser: string = ""; // Variável para guardar o nome

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    // Ouve as mudanças no nome do carrinho
    this.cartService.getCount().subscribe(count => this.cartCount = count);

    // Ouve as mudanças no nome do usuário
    this.authService.getUsername().subscribe(name => {
      this.loggedUser = name;
    });
  }

  logout() {
    this.authService.logout();
  }

  checkout() {
    if (!this.loggedUser) {
      alert('Faça login para comprar!');
      return;
    }

  const cartItems = this.cartService.getItems(); // Pega os itens (agora são CartItem[])
    if (cartItems.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }
    // Passamos a lista inteira, o serviço trata a conversão
    this.orderService.createOrder(cartItems).subscribe({
      next: (order) => {
        alert('Pedido realizado com sucesso! ID: ' + order.id);
        this.cartService.clearCart();
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao finalizar compra.');
      }
    });
  }
}
