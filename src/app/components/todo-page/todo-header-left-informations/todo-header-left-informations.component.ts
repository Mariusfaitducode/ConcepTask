import { Component, Input, OnInit } from '@angular/core';
import { Todo } from 'src/app/models/todo';
import { TodoColor } from 'src/app/utils/todo-color';
import { TodoDate } from 'src/app/utils/todo-date';

@Component({
  selector: 'app-todo-header-left-informations',
  templateUrl: './todo-header-left-informations.component.html',
  styleUrls: ['./todo-header-left-informations.component.scss'],
})
export class TodoHeaderLeftInformationsComponent  implements OnInit {

  @Input() todo!: Todo;

  constructor() { }

  ngOnInit() {}


  passedDate(){
    return TodoDate.passedDate(this.todo);
  }

  contrastColor(){
    let color = TodoColor.getCorrectTextColor(this.todo.category.color);
    return color
  }

}
