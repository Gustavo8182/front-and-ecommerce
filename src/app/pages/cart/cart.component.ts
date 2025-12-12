import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { AddressService } from '../../services/address.service';
import { CartItem } from '../../models/product.model';
import { Address } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  cartItems: CartItem[] = [];
  total: number = 0;
  isLogged: boolean = false;

  // --- Variáveis de Endereço ---
  addresses: Address[] = [];
  selectedAddressId: string = '';
  showAddressForm: boolean = false;

  newAddress: Address = {
    street: '', number: '', neighborhood: '', city: '', state: '', zipCode: '', complement: ''
  };
  // -----------------------------

constructor(
    private cartService: CartService,
    private authService: AuthService,
    private orderService: OrderService,
    private addressService: AddressService,
    private router: Router
  ) {}

ngOnInit(): void {
    this.loadCart();
    this.authService.isLoggedIn().subscribe((res: boolean) => {
      this.isLogged = res;
      if (this.isLogged) {
        this.loadAddresses(); // Se logado, busca endereços
      }
    });
  }

  loadCart() {
    this.cartItems = this.cartService.getItems();
    this.total = this.cartService.getTotal();
  }

  // --- Lógica de Endereços ---
  loadAddresses() {
    this.addressService.getMyAddresses().subscribe({
      next: (data) => {
        this.addresses = data;
        // Se tiver endereços, seleciona o primeiro automaticamente
        if (this.addresses.length > 0) {
          this.selectedAddressId = this.addresses[0].id || '';
        } else {
          this.showAddressForm = true; // Se não tiver, abre o formulário
        }
      }
    });
  }

  saveAddress() {
    this.addressService.createAddress(this.newAddress).subscribe({
      next: (address) => {
        alert('Endereço cadastrado!');
        this.showAddressForm = false;
        this.loadAddresses(); // Recarrega a lista
        // Limpa o formulário
        this.newAddress = { street: '', number: '', neighborhood: '', city: '', state: '', zipCode: '', complement: '' };
      },
      error: () => alert('Erro ao salvar endereço. Preencha tudo.')
    });
  }

  // ---------------------------


  // Aumentar quantidade (+)
increase(item: CartItem) {
    this.cartService.addToCart(item.product);
    this.loadCart();// Recarrega para atualizar totais
  }

  // Diminuir quantidade (-)
decrease(item: CartItem) {
    this.cartService.decreaseQuantity(item.product.id);
    this.loadCart();
  }

  // Remover item (Lixeira)
remove(item: CartItem) {
    this.cartService.removeItem(item.product.id);
    this.loadCart();
  }

  // Finalizar Compra (Checkout Real)
checkout() {
    if (!this.isLogged) {
      alert('Por favor, faça login.');
      this.router.navigate(['/login']);
      return;
    }

    if (this.cartItems.length === 0) return;

    if (!this.selectedAddressId) {
      alert('Por favor, selecione ou cadastre um endereço de entrega.');
      return;
    }

  // Agora passamos o ID do endereço
    this.orderService.createOrder(this.cartItems, this.selectedAddressId).subscribe({
      next: (order) => {
        alert('Pedido #' + order.id + ' realizado com sucesso!');
        this.cartService.clearCart();
        this.router.navigate(['/my-orders']);
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao processar pedido.');
      }
    });
  }
}
