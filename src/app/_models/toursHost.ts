import { User } from './user';
import { Tour } from './tour';
import { ToursSchedule } from './toursSchedule';

export class ToursHost {
    tours_host_id: number;
    tour_id: number;
    host_id: number;
    is_agreed: boolean;
    tour: Tour = new Tour();
    host: User = new User();
    toursSchedule: ToursSchedule = new ToursSchedule();
    createdAt?: string;
    updatedAt?: string;
}
  