import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyTourComponent } from './my-tour.component';

const routes: Routes = [
    {
      path:'',
      data: {
        title: 'My\'s Tour'
      },
      component: MyTourComponent
    }
  ]
  
  @NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class MyTourRoutingModule {}
