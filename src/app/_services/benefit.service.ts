import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BenefitService {

  constructor(private http: HttpClient) { }

  getBenefits(searchInputForm: any, orderType: any) {
    return this.http.get<any>(`${environment.apiUrl}/benefits?name=${searchInputForm.name.value}&order_type=${orderType}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  createBenefit(benefit: any) {
    return this.http.post<any>(`${environment.apiUrl}/benefits`, {
      name: benefit.name,
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  updateBenefit(benefit: any) {
    return this.http.put<any>(`${environment.apiUrl}/benefits/${benefit.benefit_id}`, {
      name: benefit.name,
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  deleteBenefit(benefit: any) {
    return this.http.delete<any>(`${environment.apiUrl}/benefits/${benefit.benefit_id}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }
}
