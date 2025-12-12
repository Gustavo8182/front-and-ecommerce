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

  // Adicione este método
  pay(orderId: string) {
    if(confirm('Simular pagamento deste pedido?')) {
      this.orderService.payOrder(orderId).subscribe({
        next: () => {
          alert('Pagamento confirmado! O status será atualizado.');
          this.ngOnInit(); // Recarrega a lista para ver o status novo
        },
        error: (err) => alert('Erro ao processar pagamento.')
      });
    }
  }
}
