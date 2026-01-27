import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { Page } from '../../models/page.model';

@Component({
  selector: 'app-seller-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './seller-orders.component.html',
  styleUrl: './seller-orders.component.scss'
})
export class SellerOrdersComponent implements OnInit {

  orders: Order[] = [];
  isLoading = true;

  // Paginação
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  pageSize = 10;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;

    // Chama o novo método getMySales
    this.orderService.getMySales(this.currentPage, this.pageSize).subscribe({
      next: (page: Page<Order>) => {
        this.orders = page.content;
        this.totalElements = page.totalElements;
        this.totalPages = page.totalPages;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar vendas:', err);
        this.isLoading = false;
      }
    });
  }

  // Navegação de Página
  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.currentPage = newPage;
      this.loadOrders();
    }
  }

  // Ação de mudar status
  updateStatus(order: Order, newStatus: string): void {
    const statusTraduzido = this.translateStatus(newStatus);

    if (!confirm(`Confirma a alteração do status para "${statusTraduzido}"?`)) {
      return;
    }

    this.orderService.updateStatus(order.id, newStatus).subscribe({
      next: (updatedOrder) => {
        // Atualiza a lista localmente para feedback instantâneo
        const index = this.orders.findIndex(o => o.id === updatedOrder.id);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
        alert(`Pedido atualizado para: ${statusTraduzido}`);
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao atualizar. Verifique se você é o dono da loja.');
      }
    });
  }

  // Helpers Visuais
  getStatusBadge(status: string): string {
    const badges: {[key: string]: string} = {
      'WAITING_PAYMENT': 'bg-warning text-dark',
      'PAID': 'bg-info text-dark',
      'PREPARING': 'bg-primary',
      'SHIPPED': 'bg-primary bg-gradient',
      'DELIVERED': 'bg-success',
      'CANCELED': 'bg-danger'
    };
    return badges[status] || 'bg-secondary';
  }

  translateStatus(status: string): string {
    const map: {[key: string]: string} = {
      'WAITING_PAYMENT': 'Aguardando Pagto',
      'PAID': 'Pago',
      'PREPARING': 'Preparando',
      'SHIPPED': 'Enviado',
      'DELIVERED': 'Entregue',
      'CANCELED': 'Cancelado'
    };
    return map[status] || status;
  }
}
