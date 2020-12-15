import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditTourComponent } from './edit-tour.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Edit Tour'
    },
    component: EditTourComponent
  }
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditTourRoutingModule { }
