import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ToursImageService {

  constructor(private http: HttpClient) { }

  getAllToursImages(tour_id) {
    return this.http.get<any>(`${environment.apiUrl}/tours-images?tour_id=${tour_id}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  updateStatusOfToursImage(toursImage: any, status: number) {
    return this.http.put<any>(`${environment.apiUrl}/tours-images/status/${toursImage.tours_image_id}`, {
      status: status,
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  updateStatusOfAllToursImage(tour_id: number, status: number) {
    return this.http.put<any>(`${environment.apiUrl}/tours-images/all-status`, {
      tour_id: tour_id,
      status: status,
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }
}
