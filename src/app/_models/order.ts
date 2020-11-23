import { User } from './user';
import { ToursHost } from './toursHost';
import { Coupon } from './coupon';

export class Order {
  order_id: number;
  tours_host_id: number;
  user_id: number;
  fullname: string;
  email: string;
  phone_number: string;
  language_id: number;
  number_of_people: number;
  date_time: string;
  price: number;
  coupon_id: number;
  discount: number;
  note: string;
  status: number;
  is_cancelled: boolean;
  is_paid_to_system: boolean;
  is_paid_to_host: boolean;
  toursHost: ToursHost = new ToursHost();
  user: User = new User();
  coupon: Coupon = new Coupon();
}
