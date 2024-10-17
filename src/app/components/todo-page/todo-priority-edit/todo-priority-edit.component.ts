import { Component, Input, OnInit } from '@angular/core';
// import { Todo } from 'src/app/models/todo';
import { MainTodo } from 'src/app/models/todo/main-todo';
import { SubTodo } from 'src/app/models/todo/sub-todo';

@Component({
  selector: 'app-todo-priority-edit',
  templateUrl: './todo-priority-edit.component.html',
  styleUrls: ['./todo-priority-edit.component.scss'],
})
export class TodoPriorityEditComponent  implements OnInit {

  @Input() todo!: MainTodo | SubTodo;

  constructor() { }

  ngOnInit() {}

}
