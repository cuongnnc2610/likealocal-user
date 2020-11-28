import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BecomeLocalExpertComponent } from './become-local-expert/become-local-expert.component';
import { OrderComponent} from './order/order.component';
import { ProfileComponent} from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [
      {
        path: '',
        redirectTo: 'profile',
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: {
          title: 'Profile'
        }
      },
      {
        path: 'order',
        component: OrderComponent,
        data: {
          title: 'Order'
        }
      },
      {
        path: 'become-local-expert',
        component: BecomeLocalExpertComponent,
        data: {
          title: 'Become Local Expert'
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
