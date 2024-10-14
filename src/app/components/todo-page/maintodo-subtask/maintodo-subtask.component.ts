import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Todo } from 'src/app/models/todo';

@Component({
  selector: 'app-maintodo-subtask',
  templateUrl: './maintodo-subtask.component.html',
  styleUrls: ['./maintodo-subtask.component.scss'],
})
export class MaintodoSubtaskComponent  implements OnInit {

  @Input() mainTodo!: Todo;
  @Input() todo!: Todo;

  // @Input() todos!: Todo[];

  @Input() hideDoneTasks: boolean = false;

  @Output() todoSelectedEmitter = new EventEmitter<Todo>();

  
  

  constructor() { }

  ngOnInit() {}


  onNewTodoSelected(todo: Todo){
    this.todoSelectedEmitter.emit(todo);
  }
}
