import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonnalInformationsPage } from './personnal-informations.page';

const routes: Routes = [
  {
    path: '',
    component: PersonnalInformationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonnalInformationsPageRoutingModule {}
