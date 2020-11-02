import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class MultiLanguageService {

  constructor(public translate: TranslateService) { }

  switchLang() {
    if (this.translate.currentLang === 'en') {
      localStorage.setItem('lang', 'jp');
      this.translate.use('jp');
    } else {
      localStorage.setItem('lang', 'en');
      this.translate.use('en');
    }
  }
}
