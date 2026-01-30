export interface Review {
  id?: string;
  userName: string;
  rating: number; // 1 a 5
  comment: string;
  imageUrl?: string;
  date: string;
}

export interface ReviewRequest {
  productId: string;
  orderId: string;
  rating: number;
  comment: string;
  imageUrl?: string;
}
