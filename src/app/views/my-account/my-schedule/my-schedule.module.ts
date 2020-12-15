import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyScheduleRoutingModule } from './my-schedule-routing.module';
import { MyScheduleComponent } from './my-schedule.component';
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
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    MyScheduleComponent
  ],
  imports: [
    CommonModule,
    MyScheduleRoutingModule,
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
    MatDatepickerModule,
    // MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
  ]
})
export class CardsModule { }

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
