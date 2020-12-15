import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Order } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  createOrder(order: Order) {
    console.log(order);
    return this.http.post<any>(`${environment.apiUrl}/orders`, {
      tours_host_id: order.tours_host_id,
      fullname: order.fullname,
      email: order.email,
      phone_number: order.phone_number,
      language_id: order.language_id,
      number_of_people: order.number_of_people,
      date_time: order.date_time,
      coupon: order.coupon.code,
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }
  

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

  getHostOrders(numberPage: number, searchInputForm, orderType) {
    let createdAt = '';
    if (searchInputForm.created_at.value !== '' && searchInputForm.created_at.value !== null) {      
      createdAt = searchInputForm.created_at.value.toISOString().substring(0, 10);
    }
    let dateTime = '';
    if (searchInputForm.date_time.value !== '' && searchInputForm.date_time.value !== null) {      
      dateTime = searchInputForm.date_time.value.toISOString().substring(0, 10);
    }
    console.log(searchInputForm.is_paid_to_system.value);
    return this.http.get<any>(`${environment.apiUrl}/orders/host?page=${numberPage}`
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
    + `&host_of_order=${searchInputForm.host_of_order.value}`
    + `&order_type=${orderType}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  getMyOrders(numberPage: number, orderType) {
    return this.http.get<any>(`${environment.apiUrl}/orders?page=${numberPage}`
    + `&limit=${10}`
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

  finishOrder(order: any) {
    return this.http.put<any>(`${environment.apiUrl}/orders/finish/${order.order_id}`, {
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

  confirmPaid(order: any, transactionFee, transactionNumber, sender) {
    return this.http.put<any>(`${environment.apiUrl}/orders/paid/${order.order_id}`, {
      transaction_fee: transactionFee,
      transaction_number: transactionNumber,
      sender: sender,
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

}
