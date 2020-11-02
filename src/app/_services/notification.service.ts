import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Notification } from '../_models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private http: HttpClient) { }

  getListNotification(pageNo: number) {
    let params = new HttpParams();
    params = params.append('page', pageNo.toString());
    return this.http.get(`${environment.apiUrl}/notifications`,{
      params : params
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  store(notification: Notification){
    return this.http.post(`${environment.apiUrl}/notifications`, notification)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  update(notification: Notification){
    return this.http.put(`${environment.apiUrl}/notifications/${notification.id}`, notification)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  destroy(nid : number ){
    return this.http.delete(`${environment.apiUrl}/notifications/${nid}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

}
