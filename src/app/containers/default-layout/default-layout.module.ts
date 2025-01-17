import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DefaultLayoutComponent } from './default-layout.component';
import { DialogModule, FooterModule } from '../../components';
import { NgxSpinnerModule } from 'ngx-spinner';
@NgModule({
  declarations: [
    DefaultLayoutComponent
  ],
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    FooterModule,
    DialogModule,
    NgxSpinnerModule,
  ],
  exports: [DefaultLayoutComponent]
})
export class DefaultLayoutModule { }
