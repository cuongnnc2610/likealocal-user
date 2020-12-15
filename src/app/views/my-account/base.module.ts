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

import { ProfileComponent } from './profile/profile.component';
import { OrderComponent } from './order/order.component';
import { BecomeLocalExpertComponent } from './become-local-expert/become-local-expert.component';
import { MyScheduleComponent } from './my-schedule/my-schedule.component';
import { MyTourComponent } from './my-tour/my-tour.component';
import { CreateTourComponent } from './create-tour/create-tour.component';
import { EditTourComponent } from './edit-tour/edit-tour.component';
import { HostOrderComponent } from './host-order/host-order.component';
import { WalletComponent } from './wallet/wallet.component';

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { NgxPayPalModule } from 'ngx-paypal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BaseRoutingModule,
    BsDatepickerModule.forRoot(),
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
    NgMultiSelectDropDownModule.forRoot(),
    MatDatepickerModule,
    // MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    NgxPayPalModule,
    ChartsModule
  ],
  declarations: [
    ProfileComponent,
    OrderComponent,
    BecomeLocalExpertComponent,
    MyScheduleComponent,
    MyTourComponent,
    CreateTourComponent,
    EditTourComponent,
    HostOrderComponent,
    WalletComponent
  ],
  providers: [ DatePipe ],
})
export class BaseModule { }

// // AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}