import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  constructor(private http: HttpClient) { }

  getCoupons(numberPage, searchInputForm, orderType) {
    return this.http.get<any>(`${environment.apiUrl}/coupons?page=${numberPage}&code=${searchInputForm.code.value}&is_available=${searchInputForm.filter.value}&order_type=${orderType}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  createCoupon(coupon: any) {
    return this.http.post<any>(`${environment.apiUrl}/coupons`, {
      code: coupon.code,
      discount: Number(coupon.discount),
      total_quantity: Number(coupon.total_quantity),
      is_available: coupon.is_available,
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  updateCoupon(coupon: any) {
    return this.http.put<any>(`${environment.apiUrl}/coupons/${coupon.coupon_id}`, {
      code: coupon.code,
      discount: Number(coupon.discount),
      total_quantity: Number(coupon.total_quantity),
      is_available: coupon.is_available,
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  deleteCoupon(id: number) {
    return this.http.delete<any>(`${environment.apiUrl}/coupons/${id}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }
}
