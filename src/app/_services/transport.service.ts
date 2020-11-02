import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransportService {

  constructor(private http: HttpClient) { }

  getTransports(searchInputForm: any = null, orderType: any) {
    return this.http.get<any>(`${environment.apiUrl}/transports?name=${searchInputForm ? searchInputForm.name.value : ''}&order_type=${orderType}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  createTransport(transport: any) {
    return this.http.post<any>(`${environment.apiUrl}/transports`, {
      name: transport.name,
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  updateTransport(transport: any) {
    return this.http.put<any>(`${environment.apiUrl}/transports/${transport.transport_id}`, {
      name: transport.name,
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  deleteTransport(transport: any) {
    return this.http.delete<any>(`${environment.apiUrl}/transports/${transport.transport_id}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }
}
