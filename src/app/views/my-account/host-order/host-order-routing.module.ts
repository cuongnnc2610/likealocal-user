import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HostOrderComponent } from './host-order.component';

const routes: Routes = [
    {
      path:'',
      data: {
        title: 'Host\'s Order'
      },
      component: HostOrderComponent
    }
  ]
  
  @NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class HostOrderRoutingModule {}
