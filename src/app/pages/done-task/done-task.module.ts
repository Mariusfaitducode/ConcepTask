import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DoneTaskPageRoutingModule } from './done-task-routing.module';

import { DoneTaskPage } from './done-task.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    IonicModule,
    DoneTaskPageRoutingModule
  ],
  declarations: [DoneTaskPage]
})
export class DoneTaskPageModule {}
