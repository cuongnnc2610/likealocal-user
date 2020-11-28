import { Country } from './country';

export class City {
    city_id: number;
    country_id: number;
    utc_offset: string;
    country: Country = new Country();
    name: string;
    image: string;
    createdAt?: string;
    updatedAt?: string;
}
  