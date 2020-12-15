import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyScheduleComponent } from './my-schedule.component';

const routes: Routes = [
    {
      path:'',
      data: {
        title: 'My Schedule'
      },
      component: MyScheduleComponent
    }
  ]
  
  @NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class MyScheduleRoutingModule {}
