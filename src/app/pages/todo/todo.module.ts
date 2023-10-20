import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TodoPageRoutingModule } from './todo-routing.module';

import { TodoPage } from './todo.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    IonicModule,
    TodoPageRoutingModule,
    DragDropModule,
  ],
  declarations: [TodoPage]
})
export class TodoPageModule {}
