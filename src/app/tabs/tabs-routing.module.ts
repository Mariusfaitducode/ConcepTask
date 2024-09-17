import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../pages/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'calendar',
        loadChildren: () => import('../pages/calendar/calendar.module').then(m => m.CalendarPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../pages/profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      },
      
      {
        path: 'add',
        loadChildren: () => import('../pages/add/add.module').then( m => m.AddPageModule)
      },
      {
        path: 'add/:id',
        loadChildren: () => import('../pages/add/add.module').then( m => m.AddPageModule)
      },
      {
        path: 'add/:id/:subId',
        loadChildren: () => import('../pages/add/add.module').then( m => m.AddPageModule)
      },
      {
        path: 'todo',
        loadChildren: () => import('../pages/todo/todo.module').then( m => m.TodoPageModule)
      },
      {
        path: 'todo/:id',
        loadChildren: () => import('../pages/todo/todo.module').then( m => m.TodoPageModule)
      },
      {
        path: 'todo/:id/:subId',
        loadChildren: () => import('../pages/todo/todo.module').then( m => m.TodoPageModule)
      },
      {
        path: 'todo/:day/:month/:year',
        loadChildren: () => import('../pages/todo/todo.module').then( m => m.TodoPageModule)
      },
      {
        path: 'conceptor/:id',
        loadChildren: () => import('../pages/conceptor/conceptor.module').then( m => m.ConceptorPageModule)
      },
      {
        path: 'conceptor/:id/:modalId',
        loadChildren: () => import('../pages/conceptor/conceptor.module').then( m => m.ConceptorPageModule)
      },
      {
        path: 'calendar',
        loadChildren: () => import('../pages/calendar/calendar.module').then( m => m.CalendarPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('../pages/settings/settings.module').then( m => m.SettingsPageModule)
      },
      {
        path: 'done-task',
        loadChildren: () => import('../pages/done-task/done-task.module').then( m => m.DoneTaskPageModule)
      },
      {
        path: 'feedback',
        loadChildren: () => import('../pages/feedback/feedback.module').then( m => m.FeedbackPageModule)
      },
      
    ]
  },
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
