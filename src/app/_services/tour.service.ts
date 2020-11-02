import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TourService {

  constructor(private http: HttpClient) { }

  getToursByFilter(numberPage, searchInputForm, orderType) {
    return this.http.get<any>(`${environment.apiUrl}/tours?page=${numberPage}&limit=${10}&country_id=${searchInputForm.country_id.value}&city_id=${searchInputForm.city_id.value}&category_id=${searchInputForm.category_id.value}&transport_id=${searchInputForm.transport_id.value}&host_name=${searchInputForm.host_name.value}&name=${searchInputForm.name.value}&status=${searchInputForm.status.value}&order_type=${orderType}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  getTour(tour_id: any) {
    return this.http.get<any>(`${environment.apiUrl}/tours/${tour_id}`, {
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  updateStatusOfTour(tour: any) {
    return this.http.put<any>(`${environment.apiUrl}/tours/publish/${tour.tour_id}`, {
      status: tour.new_status,
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

}
