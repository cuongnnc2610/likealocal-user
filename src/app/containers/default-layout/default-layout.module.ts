import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DefaultLayoutComponent } from './default-layout.component';
import { FooterModule } from '../../components';
@NgModule({
  declarations: [
    DefaultLayoutComponent
  ],
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    FooterModule
  ],
  exports: [DefaultLayoutComponent]
})
export class DefaultLayoutModule { }
