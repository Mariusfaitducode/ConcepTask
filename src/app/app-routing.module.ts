import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule),
  },
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full'
  },
  {
    path: 'home',
    redirectTo: 'tabs/home',
  },
  {
    path: 'add',
    redirectTo: 'tabs/add',
  },
  // {
  //   path: 'add/:id',
  //   redirectTo: 'tabs/add/:id',
  // },
  // {
  //   path: 'add/:id/:subId',
  //   redirectTo: 'tabs/add/:id/:subId',
  // },
  // {
  //   path: 'add/:day/:month/:year',
  //   redirectTo: 'tabs/add/:day/:month/:year',
  // },
  {
    path: 'todo',
    redirectTo: 'tabs/todo',
  },
  {
    path: 'todo/:id',
    redirectTo: 'tabs/todo/:id',
  },
  {
    path: 'calendar',
    redirectTo: 'tabs/calendar',
  },
  {
    path: 'settings',
    redirectTo: 'tabs/settings',
  },
  {
    path: 'done-task',
    redirectTo: 'tabs/done-task',
  },
  {
    path: 'feedback',
    redirectTo: 'tabs/feedback',
  },
  {
    path: 'profile',
    redirectTo: 'tabs/profile',
  },
  {
    path: 'team',
    redirectTo: 'tabs/team',
  },
  {
    path: 'team/:id',
    redirectTo: 'tabs/team/:id',
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
