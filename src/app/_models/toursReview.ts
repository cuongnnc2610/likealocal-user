import { Order } from './order';

export class ToursReview {
    tours_review_id: number;
    order_id: number;
    rating: number;
    content: string;
    order: Order = new Order();
    createdAt?: string;
    updatedAt?: string;
}
  