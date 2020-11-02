import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers(numberPage, searchInputForm, orderType) {
    let createdAt = '';
    if (searchInputForm.created_at.value !== '' && searchInputForm.created_at.value !== null) {      
      createdAt = searchInputForm.created_at.value.toISOString().substring(0, 10);
    }
    return this.http.get<any>(`${environment.apiUrl}/accounts?page=${numberPage}&email=${searchInputForm.email.value}&user_name=${searchInputForm.user_name.value}&is_tour_guide=${searchInputForm.is_tour_guide.value}&is_verified=${searchInputForm.is_verified.value}&level_id=${searchInputForm.level_id.value}&country_id=${searchInputForm.country_id.value}&city_id=${searchInputForm.city_id.value}&created_at=${createdAt}&order_type=${orderType}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  createUser(user: any) {
    return this.http.post<any>(`${environment.apiUrl}/sign-up`, {
      email: user.email,
      user_name: user.user_name,
      level_id: Number(user.level_id),
      password: user.password,
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  updateTourGuideStatus(id: any) {
    return this.http.put<any>(`${environment.apiUrl}/accounts/tourguide/${id}`, {
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }

  deleteUser(id: number) {
    return this.http.delete<any>(`${environment.apiUrl}/accounts/${id}`)
      .pipe(map((result: any) => {
        return result;
      }));
  }

  removeAvatar(id: any) {
    return this.http.delete<any>(`${environment.apiUrl}/accounts/avatar/${id}`, {
    })
      .pipe(map((result: any) => {
        return result;
      }));
  }
}
