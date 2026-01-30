import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { AddressService } from '../../services/address.service';
import { ShippingService } from '../../services/shipping.service';

import { CartItem } from '../../models/cart.model';
import { Address } from '../../models/address.model';
import { ShippingOption } from '../../models/shipping.model';

interface StoreCartGroup {
  storeName: string;
  storeId: string;
  items: CartItem[];
  subtotal: number; // Subtotal apenas dos produtos

  // Frete
  shippingZipCode: string;
  shippingOptions: ShippingOption[];
  selectedShipping: ShippingOption | null;
  isCalculating: boolean;
  shippingError: string | null;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  groupedItems: StoreCartGroup[] = [];
  totalGeneral: number = 0; // Soma de tudo (produtos + fretes)

  isLogged: boolean = false;
  isLoading = false;

  // Endereços
  addresses: Address[] = [];
  selectedAddressId: string = '';
  showAddressForm: boolean = false;
  newAddress: Address = { street: '', number: '', neighborhood: '', city: '', state: '', zipCode: '', complement: '' };

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private orderService: OrderService,
    private addressService: AddressService,
    private shippingService: ShippingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();

    this.cartService.getCount().subscribe(() => this.loadCart());

    this.authService.isLoggedIn().subscribe(res => {
      this.isLogged = res;
      if (this.isLogged) this.loadAddresses();
    });
  }

  // === LÓGICA PRINCIPAL: CARREGAR E AGRUPAR ===
  loadCart() {
    const allItems = this.cartService.getItems();
    const groupsMap = new Map<string, StoreCartGroup>();

    // 1. Agrupar itens por loja
    allItems.forEach(item => {
      // Se o item não tiver storeId (legado), use um ID padrão
      const storeId = item.product.store?.id || 'unknown';
      const storeName = item.product.store?.name || 'Loja Parceira';

      if (!groupsMap.has(storeId)) {
        groupsMap.set(storeId, {
          storeId,
          storeName,
          items: [],
          subtotal: 0,
          shippingZipCode: '',
          shippingOptions: [],
          selectedShipping: null,
          isCalculating: false,
          shippingError: null
        });
      }

      const group = groupsMap.get(storeId)!;
      group.items.push(item);
      group.subtotal += item.variation.price * item.quantity;
    });

    // 2. Converter Map para Array e manter estado do frete se já existia
    // (Isso evita que o frete suma quando você aumenta a quantidade de um item)
    const newGroups = Array.from(groupsMap.values());

    // Se já tínhamos grupos antes, tentamos preservar o CEP e o Frete selecionado
    if (this.groupedItems.length > 0) {
        newGroups.forEach(newGroup => {
            const oldGroup = this.groupedItems.find(g => g.storeId === newGroup.storeId);
            if (oldGroup) {
                newGroup.shippingZipCode = oldGroup.shippingZipCode;
                newGroup.shippingOptions = oldGroup.shippingOptions;
                newGroup.selectedShipping = oldGroup.selectedShipping;
            }
        });
    }

    this.groupedItems = newGroups;
    this.calculateTotalGeneral();
  }

  // Retorna só a soma dos produtos (sem frete)
  getProductsSubtotal(): number {
    return this.groupedItems.reduce((acc, g) => acc + g.subtotal, 0);
  }

  // Retorna só a soma dos fretes
  getFreightTotal(): number {
    return this.totalGeneral - this.getProductsSubtotal();
  }

  calculateTotalGeneral() {
    this.totalGeneral = this.groupedItems.reduce((acc, group) => {
      const shipping = group.selectedShipping ? group.selectedShipping.price : 0;
      return acc + group.subtotal + shipping;
    }, 0);
  }

  // === AÇÕES DO CARRINHO ===
  increase(item: CartItem) {
    this.cartService.addToCart(item.product, item.variation);
  }

  decrease(item: CartItem) {
    this.cartService.decreaseQuantity(item.variation.id);
  }

  remove(item: CartItem) {
    this.cartService.removeItem(item.variation.id);
  }

  getItemImage(item: CartItem): string {
    return item.variation.imageUrl || item.product.images?.find(i=>i.main)?.imageUrl || 'assets/placeholder.png';
  }

  // === FRETE ===
  calculateShipping(group: StoreCartGroup) {
    if (!group.shippingZipCode || group.shippingZipCode.length < 8) return;

    group.isCalculating = true;
    group.shippingError = null;

    const request = {
      storeId: group.storeId,
      zipCode: group.shippingZipCode.replace(/\D/g, ''),
      items: group.items.map(item => ({
        width: 20, height: 20, length: 20, weight: 1, // Mock
        price: item.variation.price,
        quantity: item.quantity
      }))
    };

    this.shippingService.calculate(request).subscribe({
      next: (options) => {
        group.shippingOptions = options;
        group.isCalculating = false;
        // Auto-seleciona o mais barato
        if (options.length > 0) {
            options.sort((a,b) => a.price - b.price);
            this.selectShipping(group, options[0]);
        }
      },
      error: () => {
        group.shippingError = 'Erro ao calcular frete';
        group.isCalculating = false;
      }
    });
  }

  selectShipping(group: StoreCartGroup, option: ShippingOption) {
    group.selectedShipping = option;
    this.calculateTotalGeneral();
  }

  // === ENDEREÇOS ===
 loadAddresses() {
    this.addressService.getMyAddresses().subscribe(data => {
      this.addresses = data;
      if (this.addresses.length > 0) {
         // Se já tem um selecionado, mantém, senão pega o primeiro
         if (!this.selectedAddressId) {
             this.selectedAddressId = this.addresses[0].id || '';
         }
         this.onAddressChange(); // <--- MÁGICA AQUI
      } else {
         this.showAddressForm = true;
      }
    });
  }

  // 2. Novo Método: Disparado ao trocar o endereço
  onAddressChange() {
    if (!this.selectedAddressId) return;

    // Acha o objeto endereço completo
    const selectedAddr = this.addresses.find(a => a.id === this.selectedAddressId);

    if (selectedAddr && selectedAddr.zipCode) {
        // Percorre TODAS as lojas do carrinho e calcula
        this.groupedItems.forEach(group => {
            group.shippingZipCode = selectedAddr.zipCode; // Preenche o campo visual
            this.calculateShipping(group); // Dispara o cálculo
        });
    }
  }

  saveAddress() {
      // (Mesma lógica de antes)
      this.addressService.createAddress(this.newAddress).subscribe(() => {
          this.loadAddresses();
          this.showAddressForm = false;
      });
  }

  // === CHECKOUT ===
  checkout() {
    if (!this.isLogged) return this.router.navigate(['/login']);
    if (this.groupedItems.length === 0) return;
    if (!this.selectedAddressId) return alert('Selecione um endereço');

    this.isLoading = true;

    // AQUI O BICHO PEGA: Temos que mandar pedidos separados por loja ou um array?
    // O backend atual aceita 1 pedido por vez.
    // Vamos fazer um loop e enviar N pedidos (MVP) ou ajustar o backend para receber lista.
    // Pelo que fizemos no backend, ele gera pedidos separados internamente.
    // Vamos mandar tudo junto e deixar o backend se virar (Split Order).

    // MAS ESPERA: O backend precisa saber o frete escolhido para cada item.
    // Isso é complexo para agora. Vamos simplificar: enviamos os itens e o backend calcula o total.
    // O valor do frete escolhido no front é visual. No backend real, teríamos que persistir essa escolha.

    const orderData = {
      addressId: this.selectedAddressId,
      items: this.groupedItems.flatMap(g => g.items.map(i => ({
         variationId: i.variation.id,
         quantity: i.quantity
      })))
    };

    this.orderService.createOrder(orderData).subscribe({
      next: () => {
        alert('Pedido(s) realizado(s)!');
        this.cartService.clearCart();
        this.router.navigate(['/my-orders']);
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao finalizar compra');
        this.isLoading = false;
      }
    });
  }
}
