import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { ReviewService } from '../../services/review.service';
import { ReviewRequest } from '../../models/review.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss'
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true;
  // Controle do Modal
  showReviewModal = false;
  selectedItem: any = null; // Item que está sendo avaliado
  selectedOrderId: string = '';
  // Dados do Formulário
  rating = 5;
  comment = '';
  imageUrl = '';

  constructor(
    private orderService: OrderService,
    private reviewService: ReviewService
  ) {}

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

  // Abrir Modal
  openReviewModal(orderId: string, item: any) {
    this.selectedOrderId = orderId;
    this.selectedItem = item;
    this.rating = 5;
    this.comment = '';
    this.imageUrl = '';
    this.showReviewModal = true;
  }
  // Enviar
  submitReview() {
    if (!this.selectedItem) return;

    const reviewDto: ReviewRequest = {
        orderId: this.selectedOrderId,
        // O Back-end espera o ID do PRODUTO PAI, mas o item tem variação.
        // Precisamos garantir que temos o ID do produto.
        // Se o seu OrderItemDto no Java retorna 'productName', idealmente deveria retornar 'productId' também.
        // Assumindo que você ajustou o DTO do OrderItem no Java para incluir 'productId'.
        // SE NÃO TIVER: Teremos que ajustar o DTO no Java agora (veja nota abaixo).
        productId: this.selectedItem.productId,
        rating: this.rating,
        comment: this.comment,
        imageUrl: this.imageUrl
    };

    this.reviewService.createReview(reviewDto).subscribe({
        next: () => {
            alert('Avaliação enviada com sucesso!');
            this.showReviewModal = false;
        },
        error: (err) => {
            console.error(err);
            alert('Erro ao enviar avaliação: ' + (err.error?.message || 'Erro desconhecido'));
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
