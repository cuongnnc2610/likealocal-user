import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(map((result: any) => {
      if (result.body) {
        if (result.body.code === 'C004' || result.body.code === 'C005') {
          this.authenticationService.logout();
          location.reload(true);
        }
      }
      return result;
    }), catchError(err => {
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        this.authenticationService.logout();
        location.reload(true);
      }
      if ([401, 403].indexOf(err.status) !== -1) {
        this.authenticationService.logout();
        location.reload(true);
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }
}
