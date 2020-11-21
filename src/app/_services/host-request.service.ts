import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HostRequestService {

  constructor(private http: HttpClient) { }

  getHostRequests(numberPage, searchInputForm, orderType) {
    let updateAt = '';
    if (searchInputForm.updated_at.value !== '' && searchInputForm.updated_at.value !== null) {      
      updateAt = searchInputForm.updated_at.value.toISOString().substring(0, 10);
    }
    let requestStatus = '';
    if (searchInputForm.request_status.value !== '' && searchInputForm.request_status.value !== null) {      
      requestStatus = searchInputForm.request_status.value;
    }
    return this.http.get<any>(`${environment.apiUrl}/host-requests?page=${numberPage}&email=${searchInputForm.email.value}&user_name=${searchInputForm.user_name.value}&country_id=${searchInputForm.country_id.value}&city_id=${searchInputForm.city_id.value}&updated_at=${updateAt}&request_status=${requestStatus}&order_type=${orderType}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  approveOrRejectHostRequest(id: any, request_status: number) {
    return this.http.put<any>(`${environment.apiUrl}/host-requests/approve-reject/${id}`, {
      request_status: request_status,
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }
}
