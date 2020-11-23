import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ToursReviewService {

  constructor(private http: HttpClient) { }

  getToursReviews(numberPage, tourId, orderType) {
    return this.http.get<any>(`${environment.apiUrl}/tours-reviews?page=${numberPage}&tour_id=${tourId}&limit=${5}&order_type=${orderType}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  deleteToursReview(toursReview: any) {
    return this.http.delete<any>(`${environment.apiUrl}/tours-reviews/${toursReview.tours_review_id}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  createToursReview(tourId: number, rating: number, content: string) {
    return this.http.post<any>(`${environment.apiUrl}/tours-reviews`, {
      tour_id: tourId,
      rating: rating,
      content: content
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }
}
