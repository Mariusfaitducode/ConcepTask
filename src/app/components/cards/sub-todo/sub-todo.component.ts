import { Component, Input, OnInit } from '@angular/core';
import { ItemReorderEventDetail } from '@ionic/angular';
import { Todo } from 'src/app/models/todo';
import { TodoDate } from 'src/app/utils/todo-date';

@Component({
  selector: 'app-sub-todo',
  templateUrl: './sub-todo.component.html',
  styleUrls: ['./sub-todo.component.scss'],
})
export class SubTodoComponent  implements OnInit {

  constructor() { }

  @Input() subTodo: Todo = new Todo();
  @Input() todo: Todo = new Todo();
  @Input() index: number = 0;
  @Input() page: string = "";

  ngOnInit() {}

  deleteSubTodo(){
    console.log(this.todo);
    console.log(this.subTodo);
    console.log(this.index);

    this.todo.list.splice(this.index, 1);
  }


  passedDate(){
    return TodoDate.passedDate(this.subTodo);
  }

}
