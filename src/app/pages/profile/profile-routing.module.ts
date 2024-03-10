import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePage } from './profile.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./connexion/sign-up/sign-up.module').then( m => m.SignUpPageModule)
  },
  {
    path: 'log-in',
    loadChildren: () => import('./connexion/log-in/log-in.module').then( m => m.LogInPageModule)
  },  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
