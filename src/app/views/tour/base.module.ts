// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BaseRoutingModule } from './base-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DialogModule } from '../../components';
import { NgxSpinnerModule } from 'ngx-spinner';

import { IndexComponent } from './index/index.component';
import { DetailComponent } from './detail/detail.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BaseRoutingModule,
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: httpTranslateLoader,
              deps: [HttpClient]
            }
          }),
    NgbPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    NgxSpinnerModule,
  ],
  declarations: [
    IndexComponent,
    DetailComponent,
  ]
})
export class BaseModule { }

// // AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}