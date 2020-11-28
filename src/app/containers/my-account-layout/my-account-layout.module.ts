import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MyAccountLayoutComponent } from './my-account-layout.component';
import { DialogModule, FooterModule } from '../../components';
import { NgxSpinnerModule } from 'ngx-spinner';
@NgModule({
  declarations: [
    MyAccountLayoutComponent
  ],
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    FooterModule,
    DialogModule,
    NgxSpinnerModule,
  ],
  exports: [MyAccountLayoutComponent]
})
export class MyAccountLayoutModule { }
