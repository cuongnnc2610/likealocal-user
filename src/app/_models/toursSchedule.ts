import { DateTime } from './dateTime';
import { DayTime } from './dayTime';

export class ToursSchedule {
    tours_schedule_id: number;
    tours_host_id: number;
    included_datetimes: DateTime[] = [];
    excluded_datetimes: DateTime[] = [];
    everyweek_recurring_days: DayTime[] = [];
    everyday_recurring_hours: string[] = [];
    recurring_unit: string;
    is_recurring: boolean;
    is_blocked: boolean;
    createdAt?: string;
    updatedAt?: string;
}
  