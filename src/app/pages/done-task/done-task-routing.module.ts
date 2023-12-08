import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DoneTaskPage } from './done-task.page';

const routes: Routes = [
  {
    path: '',
    component: DoneTaskPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoneTaskPageRoutingModule {}
