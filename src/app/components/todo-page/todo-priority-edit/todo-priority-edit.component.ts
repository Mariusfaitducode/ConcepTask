import { Component, Input, OnInit } from '@angular/core';
import { Todo } from 'src/app/models/todo';

@Component({
  selector: 'app-todo-priority-edit',
  templateUrl: './todo-priority-edit.component.html',
  styleUrls: ['./todo-priority-edit.component.scss'],
})
export class TodoPriorityEditComponent  implements OnInit {

  @Input() todo!: Todo;

  constructor() { }

  ngOnInit() {}

}
