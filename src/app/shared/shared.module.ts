import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoCardComponent } from '../component/cards/todo-card/todo-card.component';
import { IonicModule } from '@ionic/angular';
import { SubTodoComponent } from '../component/cards/sub-todo/sub-todo.component';
import { AddModalComponent } from '../component/add-modal/add-modal.component';
import { FormsModule } from '@angular/forms';
import { SubTaskComponent } from '../component/cards/sub-task/sub-task.component';
import { CustomConfigComponent } from '../component/selection/custom-config/custom-config.component';
import { LeftMenuComponent } from '../component/left-menu/left-menu.component';
import { ButtonAddSubTaskComponent } from '../component/selection/button-add-sub-task/button-add-sub-task.component';
import { DateSelectorComponent } from '../component/selection/date-selector/date-selector.component';
import { NodeModalComponent } from '../component/node-modal/node-modal.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HttpClient, HttpClientModule } from '@angular/common/http';



export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    
    HttpClientModule,
    CommonModule,
    FormsModule,
    IonicModule,
    DragDropModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [
    TodoCardComponent,
    SubTodoComponent,
    SubTaskComponent,
    AddModalComponent,
    NodeModalComponent,
    CustomConfigComponent,
    LeftMenuComponent,
    ButtonAddSubTaskComponent,
    DateSelectorComponent,
  ],
  exports:[
    TodoCardComponent, 
    SubTodoComponent, 
    AddModalComponent, 
    NodeModalComponent,
    SubTaskComponent, 
    CustomConfigComponent, 
    LeftMenuComponent, 
    ButtonAddSubTaskComponent,
    DateSelectorComponent,
    TranslateModule
  ]
})
export class SharedModule { }
