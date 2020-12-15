import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateTourComponent } from './create-tour.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Create Tour'
    },
    component: CreateTourComponent
  }
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateTourRoutingModule { }
