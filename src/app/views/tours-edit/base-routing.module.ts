import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailComponent} from './detail/detail.component';
import { IndexComponent} from './index/index.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        redirectTo: 'index',
      },
      {
        path: 'index',
        component: IndexComponent,
        data: {
          title: 'Tours'
        }
      },
      {
        path: 'detail',
        component: DetailComponent,
        data: {
          title: 'Detail Tour'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule {}
