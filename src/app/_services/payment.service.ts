import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  requestWithdraw(withdrawFrom: any) {
    return this.http.post<any>(`${environment.apiUrl}/payments/withdraw`, {
      receiver: withdrawFrom.email.value,
      amount_value: withdrawFrom.amount_value.value,
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }
}
