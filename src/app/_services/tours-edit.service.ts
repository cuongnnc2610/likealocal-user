import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ToursEditService {

  constructor(private http: HttpClient) { }

  getToursEdits(numberPage, searchInputForm, orderType) {
    return this.http.get<any>(`${environment.apiUrl}/tours-edits?page=${numberPage}&limit=${10}&country_id=${searchInputForm.country_id.value}&city_id=${searchInputForm.city_id.value}&category_id=${searchInputForm.category_id.value}&transport_id=${searchInputForm.transport_id.value}&host_name=${searchInputForm.host_name.value}&name=${searchInputForm.name.value}&status=${searchInputForm.status.value}&order_type=${orderType}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  getToursEdit(tours_edit_id: any) {
    return this.http.get<any>(`${environment.apiUrl}/tours-edits/${tours_edit_id}`, {
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  approveToursEdit(toursEdit: any) {
    return this.http.put<any>(`${environment.apiUrl}/tours-edits/approve/${toursEdit.tours_edit_id}`, {
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  rejectToursEdit(toursEdit: any) {
    return this.http.put<any>(`${environment.apiUrl}/tours-edits/reject/${toursEdit.tours_edit_id}`, {
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

}
