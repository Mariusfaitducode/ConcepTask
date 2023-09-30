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
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule)
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
    path: 'calendar',
    loadChildren: () => import('./pages/calendar/calendar.module').then( m => m.CalendarPageModule)
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
