import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexRoutingModule } from './index-routing.module';
import { IndexComponent } from './index.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DialogModule } from '../../components';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  declarations: [
    IndexComponent,
  ],
  imports: [
    CommonModule,
    BsDatepickerModule.forRoot(),
    IndexRoutingModule,
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
    ChartsModule,
    BsDropdownModule,
  ]
})
export class IndexModule { }

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
