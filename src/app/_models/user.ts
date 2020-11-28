import { City } from './city';
import { Order } from './order';
import { Tour } from './tour';
import { Level } from './level';
import { UsersLanguage } from './usersLanguage';

export class User {
  token: string;
  user_id: number;
  email: string;
  user_name: string;
  level_id: number;
  is_tour_guide: boolean;
  avatar: string;
  introduction_video: string;
  self_introduction: string;
  city_id: number;
  phone_number: string;
  is_verified: boolean;
  request_status: number;
  createdAt: string;
  rating: number;
  number_of_reviews: number;
  level: Level = new Level();
  city: City = new City();
  usersLanguages: UsersLanguage[] = [];
  languages: string = '';
  orders: Order[] = [];
  tours: Tour[]= [];
}
