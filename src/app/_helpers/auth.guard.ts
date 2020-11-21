import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  canActivate() {
    const currentUser = this.authenticationService.currentUserValue;
    const token = JSON.parse(sessionStorage.getItem('currentUser'))?.token;
    if (currentUser && token) {
      // logged in so return true
      return true;
    }

    //not logged in so redirect to login page with the return url
    this.router.navigate(['/login']);

    return true;
  }
}
