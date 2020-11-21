import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DialogModule, FooterModule } from '../../components';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  imports: [
    FormsModule,
    HomeRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    CommonModule,
    BsDatepickerModule.forRoot(),
    NgbPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    ModalModule.forRoot(),
    DialogModule,
    NgxSpinnerModule,
    FooterModule,
    MatDatepickerModule,
    // MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
  ],
  declarations: [ HomeComponent ]
})
export class HomeModule { }

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
