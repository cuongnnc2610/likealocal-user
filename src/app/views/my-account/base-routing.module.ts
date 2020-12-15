import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BecomeLocalExpertComponent } from './become-local-expert/become-local-expert.component';
import { OrderComponent} from './order/order.component';
import { ProfileComponent} from './profile/profile.component';
import { MyScheduleComponent } from './my-schedule/my-schedule.component';
import { MyTourComponent } from './my-tour/my-tour.component';
import { CreateTourComponent } from './create-tour/create-tour.component';
import { EditTourComponent } from './edit-tour/edit-tour.component';
import { HostOrderComponent } from './host-order/host-order.component';
import { WalletComponent} from './wallet/wallet.component';

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
      {
        path: 'my-schedule',
        component: MyScheduleComponent,
        data: {
          title: 'My\'s Schedule'
        }
      },
      {
        path: 'my-tours',
        component: MyTourComponent,
        data: {
          title: 'My\'s Tours'
        }
      },
      {
        path: 'my-tours/:id',
        component: EditTourComponent,
        data: {
          title: 'Edit Tour'
        }
      },
      {
        path: 'create-tour',
        component: CreateTourComponent,
        data: {
          title: 'Create Tour'
        }
      },
      {
        path: 'host-order',
        component: HostOrderComponent,
        data: {
          title: 'Host\'s Order'
        }
      },
      {
        path: 'wallet',
        component: WalletComponent,
        data: {
          title: 'Wallet'
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
