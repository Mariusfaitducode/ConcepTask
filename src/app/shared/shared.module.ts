import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoCardComponent } from '../component/todo-card/todo-card.component';
import { IonicModule } from '@ionic/angular';
import { SubTodoComponent } from '../component/sub-todo/sub-todo.component';
import { AddModalComponent } from '../component/add-modal/add-modal.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  imports: [
    
    CommonModule,
    FormsModule,
    IonicModule,
    

  ],
  declarations: [
    TodoCardComponent,
    SubTodoComponent,
    AddModalComponent,
    
  ],
  exports:[TodoCardComponent, SubTodoComponent, AddModalComponent]
})
export class SharedModule { }
