import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.scss'
})
export class AdminOrdersComponent implements OnInit {

  orders: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        // Ordena por data (mais novos primeiro)
        this.orders = data.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao carregar pedidos. Verifique se você é Admin.');
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
