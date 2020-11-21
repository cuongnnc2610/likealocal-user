import { Category } from './category';
import { Transport } from './transport';
import { City } from './city';
import { User } from './user';
import { ToursBenefit } from './toursBenefit';
import { ToursPlace } from './toursPlace';
import { ToursImage } from './toursImage';
import { ToursHost } from './toursHost';

export class Tour {
    tour_id: number;
    name: string;
    description: string;
    sale_price: number;
    city: City = new City();
    category: Category = new Category();
    transport: Transport = new Transport();
    host: User = new User();
    rating: number;
    max_people: number;
    languages: string[] = [];
    toursBenefits: ToursBenefit[] = [];
    toursPlaces: ToursPlace[] = [];
    toursImages: ToursImage[] = [];
    toursHosts: ToursHost[] = [];
    status: number;
    new_status: number;
    createdAt?: string;
    updatedAt?: string;
}
  