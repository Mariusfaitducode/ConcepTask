import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoCardComponent } from '../components/cards/todo-card/todo-card.component';
import { IonicModule } from '@ionic/angular';
import { SubTodoComponent } from '../components/cards/sub-todo/sub-todo.component';
import { AddModalComponent } from '../components/add-modal/add-modal.component';
import { FormsModule } from '@angular/forms';
import { SubTaskComponent } from '../components/cards/sub-task/sub-task.component';
import { CustomConfigComponent } from '../components/selection/custom-config/custom-config.component';
import { LeftMenuComponent } from '../components/left-menu/left-menu.component';
import { ButtonAddSubTaskComponent } from '../components/selection/button-add-sub-task/button-add-sub-task.component';
import { DateSelectorComponent } from '../components/selection/date-selector/date-selector.component';
import { NodeModalComponent } from '../components/node-modal/node-modal.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HabitTrackerComponent } from '../components/habit-tracker/habit-tracker.component';
import { GraphComponent } from '../components/graph/graph.component';
import { TitleCategoryEditComponent } from '../components/todo-page/title-category-edit/title-category-edit.component';
import { TodoDescriptionComponent } from '../components/todo-page/todo-description/todo-description.component';
import { TodoPriorityEditComponent } from '../components/todo-page/todo-priority-edit/todo-priority-edit.component';
import { TodoSubTasksHeaderComponent } from '../components/todo-page/todo-sub-tasks-header/todo-sub-tasks-header.component';
import { TodoHeaderTopComponent } from '../components/todo-page/todo-header-top/todo-header-top.component';
import { TodoHeaderLeftInformationsComponent } from '../components/todo-page/todo-header-left-informations/todo-header-left-informations.component';
import { TodoHeaderRightButtonsComponent } from '../components/todo-page/todo-header-right-buttons/todo-header-right-buttons.component';




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
    HabitTrackerComponent,
    GraphComponent,

    TitleCategoryEditComponent,
    TodoDescriptionComponent,
    TodoPriorityEditComponent,
    TodoSubTasksHeaderComponent,
    TodoHeaderTopComponent,
    TodoHeaderLeftInformationsComponent,
    TodoHeaderRightButtonsComponent,
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
    TranslateModule,
    HabitTrackerComponent,
    GraphComponent,

    TitleCategoryEditComponent,
    TodoDescriptionComponent,
    TodoPriorityEditComponent,
    TodoSubTasksHeaderComponent,
    TodoHeaderTopComponent,
    TodoHeaderLeftInformationsComponent,
    TodoHeaderRightButtonsComponent,
  ]
})
export class SharedModule { }
