import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriberService {

  constructor(private http: HttpClient) { }

  getSubscribers(numberPage, searchInputForm, orderType) {
    return this.http.get<any>(`${environment.apiUrl}/subscribers?page=${numberPage}&email=${searchInputForm.email.value}&order_type=${orderType}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  createSubscriber(subscriber: any) {
    return this.http.post<any>(`${environment.apiUrl}/subscribers`, {
      email: subscriber.email,
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  deleteSubscriber(id: number) {
    return this.http.delete<any>(`${environment.apiUrl}/subscribers/${id}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }
}
