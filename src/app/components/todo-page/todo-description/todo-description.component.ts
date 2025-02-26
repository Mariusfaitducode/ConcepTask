import { Component, Input, OnInit } from '@angular/core';
// import { Todo } from 'src/app/models/todo';
import { MainTodo } from 'src/app/models/todo/main-todo';
import { SubTodo } from 'src/app/models/todo/sub-todo';

@Component({
  selector: 'app-todo-description',
  templateUrl: './todo-description.component.html',
  styleUrls: ['./todo-description.component.scss'],
})
export class TodoDescriptionComponent  implements OnInit {

  @Input() todo!: MainTodo | SubTodo;

  constructor() { }

  ngOnInit() {}

}
