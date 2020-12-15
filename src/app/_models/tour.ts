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
    cover_image: string;
    description: string;
    list_price: number;
    sale_price: number;
    city_id: number;
    city: City = new City();
    duration: number;
    category: Category = new Category();
    transport: Transport = new Transport();
    host: User = new User();
    rating: number;
    max_people: number;
    meeting_address: string;
    category_id: number;
    transport_id: number;
    languages: string[] = [];
    toursBenefits: ToursBenefit[] = [];
    toursPlaces: ToursPlace[] = [];
    toursImages: ToursImage[] = [];
    toursHosts: ToursHost[] = [];
    status: number;
    new_status: number;
    createdAt?: string;
    updatedAt?: string;

    tours_host_id: number;
    tour_schedule: any;
}
  