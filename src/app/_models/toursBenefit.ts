import { Benefit } from './benefit';

export class ToursBenefit {
    tours_benefit_id: number;
    tour_id: number;
    benefit_id: number;
    is_included: boolean;
    benefit: Benefit = new Benefit();
    createdAt?: string;
    updatedAt?: string;
}
  