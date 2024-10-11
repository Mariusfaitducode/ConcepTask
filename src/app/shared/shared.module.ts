import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoCardComponent } from '../components/cards/todo-card/todo-card.component';
import { IonicModule } from '@ionic/angular';
import { AddModalComponent } from '../components/add-modal/add-modal.component';
import { FormsModule } from '@angular/forms';
import { SubTaskComponent } from '../components/cards/sub-task/sub-task.component';
import { CustomConfigComponent } from '../components/todo-page/custom-config/custom-config.component';
import { LeftMenuComponent } from '../components/left-menu/left-menu.component';
import { ButtonAddSubTaskComponent } from '../components/todo-page/button-add-sub-task/button-add-sub-task.component';
import { DateSelectorComponent } from '../components/todo-page/date-selector/date-selector.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TodoTrackerComponent } from '../components/todo-tracker/todo-tracker.component';
import { GraphComponent } from '../components/graph/graph.component';
import { TitleCategoryEditComponent } from '../components/todo-page/title-category-edit/title-category-edit.component';
import { TodoDescriptionComponent } from '../components/todo-page/todo-description/todo-description.component';
import { TodoPriorityEditComponent } from '../components/todo-page/todo-priority-edit/todo-priority-edit.component';
import { TodoSubTasksHeaderComponent } from '../components/todo-page/todo-sub-tasks-header/todo-sub-tasks-header.component';
import { TodoHeaderTopComponent } from '../components/todo-page/todo-header-top/todo-header-top.component';
import { TodoHeaderLeftInformationsComponent } from '../components/todo-page/todo-header-left-informations/todo-header-left-informations.component';
import { TodoHeaderRightButtonsComponent } from '../components/todo-page/todo-header-right-buttons/todo-header-right-buttons.component';
import { ModalHeaderComponent } from '../components/add-modal/modal-header/modal-header.component';
import { MaintodoSubtaskComponent } from '../components/todo-page/maintodo-subtask/maintodo-subtask.component';
import { TodoSubtasksTreeComponent } from '../components/todo-page/todo-subtasks-tree/todo-subtasks-tree.component';
import { ImportExportModalComponent } from '../components/import-export-modal/import-export-modal.component';
import { TeamsGestionComponent } from '../components/teams-gestion/teams-gestion.component';



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
    SubTaskComponent,
    AddModalComponent,
    CustomConfigComponent,
    LeftMenuComponent,
    ButtonAddSubTaskComponent,
    DateSelectorComponent,
    TodoTrackerComponent,
    GraphComponent,

    TitleCategoryEditComponent,
    TodoDescriptionComponent,
    TodoPriorityEditComponent,
    TodoSubTasksHeaderComponent,
    TodoHeaderTopComponent,
    TodoHeaderLeftInformationsComponent,
    TodoHeaderRightButtonsComponent,
    MaintodoSubtaskComponent,
    TodoSubtasksTreeComponent,

    ModalHeaderComponent,
    ImportExportModalComponent,
    TeamsGestionComponent,
  ],
  exports:[
    TodoCardComponent, 
    AddModalComponent, 
    SubTaskComponent, 
    CustomConfigComponent, 
    LeftMenuComponent, 
    ButtonAddSubTaskComponent,
    DateSelectorComponent,
    TranslateModule,
    TodoTrackerComponent,
    GraphComponent,

    TitleCategoryEditComponent,
    TodoDescriptionComponent,
    TodoPriorityEditComponent,
    TodoSubTasksHeaderComponent,
    TodoHeaderTopComponent,
    TodoHeaderLeftInformationsComponent,
    TodoHeaderRightButtonsComponent,
    MaintodoSubtaskComponent,
    TodoSubtasksTreeComponent,

    ModalHeaderComponent,
    ImportExportModalComponent,
    TeamsGestionComponent,
  ]
})
export class SharedModule { }
