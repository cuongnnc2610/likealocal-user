import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailComponent } from './detail.component';

const routes: Routes = [
    {
      path:'',
      data: {
        title: 'User Detail'
      },
      component: DetailComponent
    }
  ]
  
  @NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class DetailRoutingModule {}
