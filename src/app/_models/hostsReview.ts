import { User } from './user';

export class HostsReview {
    hosts_review_id: number;
    host_id: number;
    user_id: number;
    rating: number;
    content: string;
    user: User = new User();
    host: User = new User();
    createdAt?: string;
    updatedAt?: string;
}
  