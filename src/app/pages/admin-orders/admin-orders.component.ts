import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { RouterModule } from '@angular/router';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss'
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = []; // Tipagem correta

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe({
      // CORREÇÃO: Adicione o tipo (data: Order[])
      next: (data: Order[]) => {
        // CORREÇÃO: Adicione tipos no sort (a: Order, b: Order)
        this.orders = data.sort((a: Order, b: Order) =>
          new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
        );
      },
      // CORREÇÃO: Adicione tipo no erro (err: any)
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  // Função para mudar o status (Enviado, Entregue, etc)
  changeStatus(order: any, newStatus: string) {
    if(confirm(`Tem certeza que deseja mudar o status para ${newStatus}?`)) {
      this.orderService.updateStatus(order.id, newStatus).subscribe({
        next: () => {
          alert('Status atualizado com sucesso!');
          this.loadOrders(); // Recarrega a lista
        },
        error: () => alert('Erro ao atualizar status.')
      });
    }
  }

  // Auxiliar para calcular total
  getTotal(order: any): number {
    return order.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
  }
}
