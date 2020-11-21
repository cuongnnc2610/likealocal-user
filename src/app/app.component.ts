import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "body",
  template: "<router-outlet></router-outlet>",
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.translateLang();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  translateLang() {
    this.translate.addLangs(['en', 'vn']); // Languages need to be translated
    this.translate.setDefaultLang('en');
    if (localStorage.getItem('lang') === null)
      // set default language
      this.translate.use('en');
    else
      this.translate.use(localStorage.getItem('lang'));
  }
}
