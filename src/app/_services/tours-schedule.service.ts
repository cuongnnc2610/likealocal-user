import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ToursScheduleService {

  constructor(private http: HttpClient) { }

  getAvailableSchedulesInDateAndMonth(toursHostId: number, date: string) {
    return this.http.get<any>(`${environment.apiUrl}/tours-schedules?tours_host_id=${toursHostId}&date=${date}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  toggleBlockStatus(toursHostId: number) {
    return this.http.get<any>(`${environment.apiUrl}/tours-schedules/block/${toursHostId}`, {
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  updateToursSchedule(toursHostId: number, includedDatetimes, excludedDatetimes, everyweekRecurringDays, everydayRecurringHours: string[], recurringUnit: string, isRecurring: boolean) {
    return this.http.put<any>(`${environment.apiUrl}/tours-schedules/${toursHostId}`, {
      included_datetimes: includedDatetimes,
      excluded_datetimes: excludedDatetimes,
      everyweek_recurring_days: everyweekRecurringDays,
      everyday_recurring_hours: everydayRecurringHours,
      recurring_unit: recurringUnit,
      is_recurring: isRecurring,
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }
}
