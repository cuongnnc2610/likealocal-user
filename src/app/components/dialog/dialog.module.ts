import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DialogComponent } from './dialog.component';
@NgModule({
  declarations: [
    DialogComponent
  ],
  imports: [
    CommonModule,
    ModalModule.forRoot()
  ],
  exports: [DialogComponent]
})
export class DialogModule { }
