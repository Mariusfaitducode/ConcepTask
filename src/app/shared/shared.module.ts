import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoCardComponent } from '../component/todo-card/todo-card.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  imports: [
    
    CommonModule,
    
    IonicModule,
    

  ],
  declarations: [
    TodoCardComponent
    
  ],
  exports:[TodoCardComponent]
})
export class SharedModule { }
