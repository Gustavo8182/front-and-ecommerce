import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss'
})
export class MyOrdersComponent implements OnInit {

  orders: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getMyOrders().subscribe({
      next: (data) => this.orders = data,
      error: (err) => console.error(err)
    });
  }

  // Função auxiliar para somar o total do pedido no front (já que não salvamos o total no banco)
  getTotal(order: any): number {
    return order.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
  }
}
