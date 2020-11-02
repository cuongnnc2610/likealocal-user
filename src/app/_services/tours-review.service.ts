import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ToursReviewService {

  constructor(private http: HttpClient) { }

  getToursReviews(numberPage, searchInputForm, orderType) {
    let date = '';
    if (searchInputForm.date.value !== '' && searchInputForm.date.value !== null) {      
      date = searchInputForm.date.value.toISOString().substring(0, 10);
    }
    return this.http.get<any>(`${environment.apiUrl}/tours-reviews?page=${numberPage}&content=${searchInputForm.content.value}&user=${searchInputForm.user.value}&host=${searchInputForm.host.value}&tour_name=${searchInputForm.tour_name.value}&date=${date}&order_type=${orderType}`)
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
}
