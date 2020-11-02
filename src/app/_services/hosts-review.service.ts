import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HostsReviewService {

  constructor(private http: HttpClient) { }

  getHostsReviews(numberPage, searchInputForm, orderType) {
    return this.http.get<any>(`${environment.apiUrl}/hosts-reviews?page=${numberPage}&content=${searchInputForm.content.value}&user=${searchInputForm.user.value}&host=${searchInputForm.host.value}&order_type=${orderType}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  deleteHostsReview(hostsReview: any) {
    return this.http.delete<any>(`${environment.apiUrl}/hosts-reviews/${hostsReview.hosts_review_id}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }
}
