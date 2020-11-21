import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FooterComponent } from './footer.component';
@NgModule({
  declarations: [
    FooterComponent
  ],
  imports: [
    CommonModule,
    ModalModule.forRoot()
  ],
  exports: [FooterComponent]
})
export class FooterModule { }
