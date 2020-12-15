import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HostOrderRoutingModule } from './host-order-routing.module';
import { HostOrderComponent } from './host-order.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
//Import lib translate
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
//Import module pagination
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import { DialogModule } from '../../../components';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPayPalModule } from 'ngx-paypal';


@NgModule({
  declarations: [
    HostOrderComponent
  ],
  imports: [
    CommonModule,
    HostOrderRoutingModule,
    NgbPaginationModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    NgxSpinnerModule,
    NgxPayPalModule
  ]
})
export class CardsModule { }

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}