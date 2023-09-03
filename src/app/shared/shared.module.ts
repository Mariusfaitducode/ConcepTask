import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoCardComponent } from '../component/todo-card/todo-card.component';
import { IonicModule } from '@ionic/angular';
import { SubTodoComponent } from '../component/sub-todo/sub-todo.component';



@NgModule({
  imports: [
    
    CommonModule,
    
    IonicModule,
    

  ],
  declarations: [
    TodoCardComponent,
    SubTodoComponent,
    
  ],
  exports:[TodoCardComponent, SubTodoComponent]
})
export class SharedModule { }
