import {Component} from '@angular/core';
import {navItems} from '../../_nav';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../_services/authentication.service';
import {User} from '../../_models/user';
import {MultiLanguageService} from '../../_services/multi-language.service';

@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.css']
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems = navItems;
  public currentUser: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    public multiLanguageService: MultiLanguageService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  logOut() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  switchLang() {
    this.multiLanguageService.switchLang();
  }
}
