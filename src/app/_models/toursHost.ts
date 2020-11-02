import { User } from './user';
import { Tour } from './tour';

export class ToursHost {
    tours_host_id: number;
    tour_id: number;
    host_id: number;
    is_agreed: boolean;
    tour: Tour = new Tour();
    host: User = new User();
    createdAt?: string;
    updatedAt?: string;
}
  