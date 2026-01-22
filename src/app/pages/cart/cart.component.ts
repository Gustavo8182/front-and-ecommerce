import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { AddressService } from '../../services/address.service';
import { CartItem } from '../../models/cart.model';
import { Address } from '../../models/address.model';

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
  isLoading = false;

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

    // Inscreve-se para saber se o carrinho mudou (atualiza total em tempo real)
    this.cartService.getCount().subscribe(() => {
      this.loadCart();
    });

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
      },
      error: (err) => console.error('Erro ao carregar endereços', err)
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

  // --- MÉTODOS DE AÇÃO (Usam o ID da Variação agora) ---

  increase(item: CartItem) {
    // Adiciona o mesmo produto e variação
    this.cartService.addToCart(item.product, item.variation);
    this.total = this.cartService.getTotal();
  }

  decrease(item: CartItem) {
    this.cartService.decreaseQuantity(item.variation.id); // <--- ID DA VARIAÇÃO
    this.cartItems = this.cartService.getItems();
    this.total = this.cartService.getTotal();
  }

  remove(item: CartItem) {
    this.cartService.removeItem(item.variation.id); // <--- ID DA VARIAÇÃO
    this.cartItems = this.cartService.getItems();
    this.total = this.cartService.getTotal();
  }

  // --- AUXILIAR VISUAL ---

  getItemImage(item: CartItem): string {
    // 1. Tenta imagem da variação
    if (item.variation.imageUrl) return item.variation.imageUrl;

    // 2. Tenta imagem principal do produto
    if (item.product.images && item.product.images.length > 0) {
      const main = item.product.images.find(i => i.main);
      return main ? main.imageUrl : item.product.images[0].imageUrl;
    }

    return 'assets/img/sem-foto.jpg';
  }

 checkout() {
    if (!this.isLogged) {
      alert('Por favor, faça login para continuar.');
      this.router.navigate(['/login']);
      return;
    }

    if (this.cartItems.length === 0) return;

    if (!this.selectedAddressId) {
      alert('Por favor, selecione um endereço de entrega.');
      return;
    }

    this.isLoading = true; // Bloqueia o botão

    const orderData = {
      addressId: this.selectedAddressId,
      items: this.cartItems.map(item => ({
        variationId: item.variation.id,
        quantity: item.quantity
      }))
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (order) => {
        alert('Pedido realizado com sucesso! 🎉');

        // --- LIMPEZA DE CARRINHO ---
        this.cartService.clearCart();
        // --------------------------

        this.isLoading = false;

        // CORREÇÃO: O caminho correto para a tela do comprador é /my-orders
        this.router.navigate(['/my-orders']);
      },
      error: (err) => {
        console.error('Erro ao criar pedido:', err);
        alert('Erro ao processar pedido. Tente novamente.');
        this.isLoading = false;
      }
    });
  }
}
