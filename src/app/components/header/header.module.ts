import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HeaderComponent } from './header.component';
@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    ModalModule.forRoot()
  ],
  exports: [HeaderComponent]
})
export class HeaderModule { }
