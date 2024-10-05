import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Todo } from 'src/app/models/todo';
import { TaskService } from 'src/app/services/task/task.service';

@Component({
  selector: 'app-todo-header-top',
  templateUrl: './todo-header-top.component.html',
  styleUrls: ['./todo-header-top.component.scss'],
})
export class TodoHeaderTopComponent  implements OnInit {

  @Input() mainTodo!: Todo;
  @Input() todo!: Todo;
  @Output() goBackEmitter = new EventEmitter();

  @Input() synchronized: boolean = true;

  constructor(
    private taskService: TaskService,    
  ) { }

  ngOnInit() {}


  goBackTodo(){
    // if (this.todoHistoryList.length > 0 && this.subMode == 'tree'){
    //   this.todo = this.todoHistoryList.pop()!;
    // }
    // else{
    //   this.navCtrl.back();
    // }

    this.goBackEmitter.emit();
  }

  // TODO : Already on todo page, verify possibility to remove
  // isTodoSynchronized(): boolean {
  //   return this.mainTodo && JSON.stringify(this.mainTodo) == JSON.stringify(this.taskService.getTodosAsInStorageWithoutSync().find(todo => todo.id == this.mainTodo.id));
  // }
}
