import { Component, Input, OnInit } from '@angular/core';
import { ItemReorderEventDetail } from '@ionic/angular';
import { Todo } from 'src/app/models/todo';

@Component({
  selector: 'app-sub-todo',
  templateUrl: './sub-todo.component.html',
  styleUrls: ['./sub-todo.component.scss'],
})
export class SubTodoComponent  implements OnInit {

  constructor() { }

  @Input() subTodo: any;
  @Input() todo: any;
  @Input() index: any;
  @Input() page: string = "";

  ngOnInit() {}

  deleteSubTodo(){
    console.log(this.todo);
    console.log(this.subTodo);
    console.log(this.index);

    this.todo.list.splice(this.index, 1);
  }


  passedDate(){
    return Todo.passedDate(this.subTodo);
  }

}
