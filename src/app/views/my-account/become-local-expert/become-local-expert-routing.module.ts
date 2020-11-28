import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BecomeLocalExpertComponent } from './become-local-expert.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Become Local Expert'
    },
    component: BecomeLocalExpertComponent
  }
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BecomeLocalExpertRoutingModule { }
