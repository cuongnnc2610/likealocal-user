import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  getOrders(numberPage: number, searchInputForm, orderType) {
    let createdAt = '';
    if (searchInputForm.created_at.value !== '' && searchInputForm.created_at.value !== null) {      
      createdAt = searchInputForm.created_at.value.toISOString().substring(0, 10);
    }
    let dateTime = '';
    if (searchInputForm.date_time.value !== '' && searchInputForm.date_time.value !== null) {      
      dateTime = searchInputForm.date_time.value.toISOString().substring(0, 10);
    }
    console.log(searchInputForm.is_paid_to_system.value);
    return this.http.get<any>(`${environment.apiUrl}/orders?page=${numberPage}`
    + `&limit=${10}`
    + `&order_id=${searchInputForm.order_id.value}`
    + `&is_paid_to_host=${searchInputForm.is_paid_to_host.value}`
    + `&host_name=${searchInputForm.host_name.value}`
    + `&user_name=${searchInputForm.user_name.value}`
    + `&tour_name=${searchInputForm.tour_name.value}`
    + `&is_paid_to_system=${searchInputForm.is_paid_to_system.value}`
    + `&is_cancelled=${searchInputForm.is_cancelled.value}`
    + `&date_time=${dateTime}`
    + `&phone_number=${searchInputForm.phone_number.value}`
    + `&email=${searchInputForm.email.value}`
    + `&fullname=${searchInputForm.fullname.value}`
    + `&created_at=${createdAt}`
    + `&status=${searchInputForm.status.value}`
    + `&order_type=${orderType}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  getOrder(order_id: any) {
    return this.http.get<any>(`${environment.apiUrl}/orders/${order_id}`, {
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  confirmOrder(order: any) {
    return this.http.put<any>(`${environment.apiUrl}/orders/confirm/${order.order_id}`, {
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  completeOrder(order: any) {
    return this.http.put<any>(`${environment.apiUrl}/orders/complete/${order.order_id}`, {
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  cancelOrder(order: any) {
    return this.http.put<any>(`${environment.apiUrl}/orders/cancel/${order.order_id}`, {
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

}
