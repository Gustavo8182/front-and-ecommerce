import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service'; // Ajuste o caminho se necessário
import { Order } from '../../models/order.model';
import { Page } from '../../models/page.model';

@Component({
  selector: 'app-seller-orders',
  standalone: true, // Angular 19+
  imports: [CommonModule, RouterModule],
  templateUrl: './seller-orders.component.html',
  styleUrl: './seller-orders.component.scss' // Ou .css se for seu caso
})
export class SellerOrdersComponent implements OnInit {
  orders: Order[] = [];
  totalElements = 0;
  isLoading = true;
  currentPage = 0;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    // Chama o método específico de VENDEDOR (que criamos no OrderService)
    this.orderService.getStoreOrders(this.currentPage).subscribe({
      next: (page: Page<Order>) => {
        this.orders = page.content;
        this.totalElements = page.totalElements;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar vendas:', err);
        this.isLoading = false;
        // O ErrorInterceptor vai mostrar o alert se der erro
      }
    });
  }

  // Cores dos Badges
  getStatusBadge(status: string): string {
    const badges: {[key: string]: string} = {
      'WAITING_PAYMENT': 'bg-warning text-dark',
      'PAID': 'bg-info text-white',
      'SHIPPED': 'bg-primary',
      'DELIVERED': 'bg-success',
      'CANCELED': 'bg-danger'
    };
    return badges[status] || 'bg-secondary';
  }

  // Tradução dos Status
  translateStatus(status: string): string {
    const map: {[key: string]: string} = {
      'WAITING_PAYMENT': 'Aguardando Pagamento',
      'PAID': 'Pago',
      'SHIPPED': 'Enviado',
      'DELIVERED': 'Entregue',
      'CANCELED': 'Cancelado'
    };
    return map[status] || status;
  }
}
