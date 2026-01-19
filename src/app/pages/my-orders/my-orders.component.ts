import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss'
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getMyOrders().subscribe({
      next: (data: any) => {
        // Se o back retornar paginado (Page<Order>), usamos data.content
        // Se retornar lista direta (List<Order>), usamos data
        this.orders = data.content ? data.content : data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar pedidos', err);
        this.isLoading = false;
      }
    });
  }

  getStatusColor(status: string): string {
    const colors: {[key: string]: string} = {
      'WAITING_PAYMENT': 'text-warning',
      'PAID': 'text-info',
      'SHIPPED': 'text-primary',
      'DELIVERED': 'text-success',
      'CANCELED': 'text-danger'
    };
    return colors[status] || 'text-secondary';
  }
}
