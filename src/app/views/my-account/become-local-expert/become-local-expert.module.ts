import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BecomeLocalExpertRoutingModule } from './become-local-expert-routing.module';
import { BecomeLocalExpertComponent } from './become-local-expert.component';
import { ModalModule } from 'ngx-bootstrap/modal';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

//Import lib translate
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

//Import module pagination
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import { DialogModule } from '../../../components';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    BecomeLocalExpertComponent,
  ],
  imports: [
    CommonModule,
    BecomeLocalExpertRoutingModule,
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
    // NgMultiSelectDropDownModule.forRoot()
  ]
})
export class IndexModule { }

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
