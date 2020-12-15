import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ToursHostService {

  constructor(private http: HttpClient) { }

  getAllToursHostsByTour(tourId) {
    return this.http.get<any>(`${environment.apiUrl}/tours-hosts?tour_id=${tourId}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  getAllToursHostsByHost() {
    return this.http.get<any>(`${environment.apiUrl}/tours-hosts/tours`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  deleteToursHost(toursHost: any) {
    return this.http.delete<any>(`${environment.apiUrl}/tours-hosts/${toursHost.tours_host_id}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  updateAgreeStatusOfToursHost(toursHost: any) {
    return this.http.put<any>(`${environment.apiUrl}/tours-hosts/agree/${toursHost.tours_host_id}`, {
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  requestGuideTour(tourId: number) {
    return this.http.post<any>(`${environment.apiUrl}/tours-hosts/guide`, {
      tour_id: tourId,
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }
}
