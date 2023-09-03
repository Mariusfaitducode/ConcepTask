import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sub-todo',
  templateUrl: './sub-todo.component.html',
  styleUrls: ['./sub-todo.component.scss'],
})
export class SubTodoComponent  implements OnInit {

  constructor() { }

  @Input() todo: any;

  ngOnInit() {}

}
