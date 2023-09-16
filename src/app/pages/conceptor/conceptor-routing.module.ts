import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConceptorPage } from './conceptor.page';

const routes: Routes = [
  {
    path: '',
    component: ConceptorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConceptorPageRoutingModule {}
