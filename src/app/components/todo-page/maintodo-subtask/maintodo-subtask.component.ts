import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MainTodo } from 'src/app/models/todo/main-todo';
import { SubTodo } from 'src/app/models/todo/sub-todo';
// import { Todo } from 'src/app/models/todo';

@Component({
  selector: 'app-maintodo-subtask',
  templateUrl: './maintodo-subtask.component.html',
  styleUrls: ['./maintodo-subtask.component.scss'],
})
export class MaintodoSubtaskComponent  implements OnInit {

  @Input() mainTodo!: MainTodo;
  @Input() todo!: SubTodo;

  // @Input() todos!: Todo[];

  @Input() hideDoneTasks: boolean = false;

  @Output() todoSelectedEmitter = new EventEmitter<SubTodo>();

  
  

  constructor() { }

  ngOnInit() {}


  onNewTodoSelected(todo: SubTodo){
    this.todoSelectedEmitter.emit(todo);
  }
}
