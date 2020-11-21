import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

import {AuthenticationService} from '../_services';
import {environment} from '../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const user = this.authenticationService.currentUserValue;
    const isLoggedIn = user && user.token;
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    const token = JSON.parse(sessionStorage.getItem('currentUser'))?.token;
    const d = new Date();
    // const n = d.getTimezoneOffset();
    const n = 0;
    if (isLoggedIn && isApiUrl && token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${user.token}`,
          timezone_offset: `${n}`
        }
      });
    }
    return next.handle(request);
  }
}
