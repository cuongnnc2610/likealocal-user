import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent, MyAccountLayoutComponent } from './containers';
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent,EmailInputComponent,ResetPwdComponent } from './views/auths-management';

import { AuthGuard } from './_helpers/auth.guard';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'reset-password',
    component: ResetPwdComponent,
    data: {
      title: 'Reset Password'
    }
  },
  {
    path: 'email-input',
    component: EmailInputComponent,
    data: {
      title: 'Input Email Address'
    }
  },
  {
    path: 'home',
    // component: HomeComponent,
    loadChildren: () => import('./views/home/home.module').then(m => m.HomeModule),
    data: {
      title: 'Home'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: 'destination',
        loadChildren: () => import('./views/destination/index.module').then(m => m.IndexModule)
      },
      {
        path: 'tour-list',
        loadChildren: () => import('./views/tour-list/index.module').then(m => m.IndexModule)
      },
      {
        path: 'tour-detail/:id',
        loadChildren: () => import('./views/tour-detail/index.module').then(m => m.IndexModule)
      },
      {
        path: 'tour-booking',
        loadChildren: () => import('./views/tour-booking/index.module').then(m => m.IndexModule)
      },
      {
        path: 'order-confirmed',
        loadChildren: () => import('./views/order-confirmed/index.module').then(m => m.IndexModule)
      },
      {
        path: 'host/:id',
        loadChildren: () => import('./views/host/index.module').then(m => m.IndexModule)
      },
      {
        path: 'account',
        component: DefaultLayoutComponent,
        children: [
          {
            path: 'destination',
            loadChildren: () => import('./views/destination/index.module').then(m => m.IndexModule)
          },
        ],
        // loadChildren: () => import('./views/host/index.module').then(m => m.IndexModule)
      },
      {
        path: 'transaction',
        // canActivate: [AuthGuard],
        loadChildren: () => import('./views/transaction/index.module').then(m => m.IndexModule)
      },
      {
        path: 'order',
        // canActivate: [AuthGuard],
        loadChildren: () => import('./views/order/index.module').then(m => m.IndexModule)
      },
      {
        path: 'user',
        // canActivate: [AuthGuard],
        loadChildren: () => import('./views/user/index.module').then(m => m.IndexModule)
      },
      {
        path: 'host-request',
        // canActivate: [AuthGuard],
        loadChildren: () => import('./views/host-request/index.module').then(m => m.IndexModule)
      },
      //////////////////////////////////////////
      {
        path: 'tour',
        // canActivate: [AuthGuard],
        loadChildren: () => import('./views/tour/base.module').then(m => m.BaseModule)
      },
      {
        path: 'tours-edit',
        // canActivate: [AuthGuard],
        loadChildren: () => import('./views/tours-edit/base.module').then(m => m.BaseModule)
      },
      {
        path: 'tours-review',
        // canActivate: [AuthGuard],
        loadChildren: () => import('./views/tours-review/index.module').then(m => m.IndexModule)
      },
      {
        path: 'coupon',
        // canActivate: [AuthGuard],
        loadChildren: () => import('./views/coupon/index.module').then(m => m.IndexModule)
      },
      {
        path: 'subscriber',
        // canActivate: [AuthGuard],
        loadChildren: () => import('./views/subscriber/index.module').then(m => m.IndexModule)
      },
      {
        path: 'benefit',
        // canActivate: [AuthGuard],
        loadChildren: () => import('./views/benefit/index.module').then(m => m.IndexModule)
      },
      {
        path: 'category',
        // canActivate: [AuthGuard],
        loadChildren: () => import('./views/category/index.module').then(m => m.IndexModule)
      },
      {
        path: 'transport',
        // canActivate: [AuthGuard],
        loadChildren: () => import('./views/transport/index.module').then(m => m.IndexModule)
      },
    ]
  },
  {
    path: 'my-account',
    component: MyAccountLayoutComponent,
    children: [
      {
        path: '',
        // canActivate: [AuthGuard],
        loadChildren: () => import('./views/my-account/base.module').then(m => m.BaseModule)
      },
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
