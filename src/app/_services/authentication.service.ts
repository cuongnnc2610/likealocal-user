import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/loginadmin`, { email, password })
      .pipe(map(user => {
        if (user.code === 20001) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          sessionStorage.setItem('currentUser', JSON.stringify(user.data));
          this.currentUserSubject.next(user.data);
        }
        return user;
      }));
  }

  forgotPassword(email: string) {
    return this.http.post<any>(`${environment.apiUrl}/users/get-token-admin`, { email })
      .pipe(map(result => {
        return result;
      }));
  }

  changePassword(resetLink: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/users/reset-password`, { reset_link: resetLink, new_password: password })
      .pipe(map(result => {
        return result;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
