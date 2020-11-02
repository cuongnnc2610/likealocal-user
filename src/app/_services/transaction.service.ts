import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) { }

  getTransactions(numberPage, searchInputForm, orderType) {
    return this.http.get<any>(`${environment.apiUrl}/transactions?page=${numberPage}&limit=${10}&order_id=${searchInputForm.order_id.value}&transaction_type_id=${searchInputForm.transaction_type_id.value}&host_email=${searchInputForm.host_email.value}&user_email=${searchInputForm.user_email.value}&order_type=${orderType}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  getCurrentBalanceOfSystem() {
    return this.http.get<any>(`${environment.apiUrl}/transactions/balance`)
      .pipe(map((result: any) => {
        return result;
      }));
  }
}
