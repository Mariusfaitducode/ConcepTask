import { Component, Input, OnInit } from '@angular/core';
import { Todo } from 'src/app/models/todo';

@Component({
  selector: 'app-todo-description',
  templateUrl: './todo-description.component.html',
  styleUrls: ['./todo-description.component.scss'],
})
export class TodoDescriptionComponent  implements OnInit {

  @Input() todo!: Todo;

  constructor() { }

  ngOnInit() {}

}
