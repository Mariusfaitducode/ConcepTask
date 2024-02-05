import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'add',
    loadChildren: () => import('./pages/add/add.module').then( m => m.AddPageModule)
  },
  {
    path: 'add/:id',
    loadChildren: () => import('./pages/add/add.module').then( m => m.AddPageModule)
  },
  {
    path: 'add/:id/:subId',
    loadChildren: () => import('./pages/add/add.module').then( m => m.AddPageModule)
  },
  {
    path: 'add/:day/:month/:year',
    loadChildren: () => import('./pages/add/add.module').then( m => m.AddPageModule)
  },
  {
    path: 'todo/:id',
    loadChildren: () => import('./pages/todo/todo.module').then( m => m.TodoPageModule)
  },
  {
    path: 'todo/:id/:subId',
    loadChildren: () => import('./pages/todo/todo.module').then( m => m.TodoPageModule)
  },
  {
    path: 'conceptor/:id',
    loadChildren: () => import('./pages/conceptor/conceptor.module').then( m => m.ConceptorPageModule)
  },
  {
    path: 'conceptor/:id/:modalId',
    loadChildren: () => import('./pages/conceptor/conceptor.module').then( m => m.ConceptorPageModule)
  },
  {
    path: 'calendar',
    loadChildren: () => import('./pages/calendar/calendar.module').then( m => m.CalendarPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'done-task',
    loadChildren: () => import('./pages/done-task/done-task.module').then( m => m.DoneTaskPageModule)
  },
  {
    path: 'feedback',
    loadChildren: () => import('./pages/feedback/feedback.module').then( m => m.FeedbackPageModule)
  },





  // { path: 'Todo/:id', },
  // { path: 'Add',},
  // { path: 'Edit/:id',},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
