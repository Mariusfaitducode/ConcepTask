import { SelectorContext } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { Todo } from 'src/app/model/todo';

@Component({
  selector: 'app-todo-card',
  templateUrl: './todo-card.component.html',
  styleUrls: ['./todo-card.component.scss'],
})
export class TodoCardComponent  implements OnInit {

  constructor() { }

  @Input() todo!: Todo;
  @Input() color!: string;

  ngOnInit() { 
    
  }

}
